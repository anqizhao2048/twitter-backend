const {User} = require("../schema/user");
const {hashPassword, comparePassword} = require("../utils/password");
const {Router} = require("express");
const jwt = require('jsonwebtoken');
const router = Router();

router.post('/signup', (req, res) => {
    User.findOne({username: req.body.username})
        .then(async user => {
            if (user != null) {
                res.status(500).send("username is already taken");
            } else {
                const saltRounds = 10;
                const hashedPassword = await hashPassword(req.body.password);

                let user = new User({
                    username: req.body.username,
                    displayName: req.body.displayName,
                    password: hashedPassword,
                    desc: req.body.desc,
                    joinedAt: Date.now(),
                    follower: [],
                    following: [],
                });

                user.save()
                    .then(savedUser => {
                        res.send(savedUser);
                    })
                    .catch(err => {
                        res.status(500).send("Internal Server Error: " + err);
                    });
            }
        })
        .catch(err => {
            res.status(500).send("Internal Server Error");
        });
});

router.post('/signin', (req, res) => {
    User.findOne({username: req.body.username})
        .then(async user => {
            if (user == null) {
                res.status(400).send("username doesn't exist");
            } else {
                let password = user['password'];
                if (await comparePassword(req.body.password, password)) {
                    res.send(user);
                } else {
                    res.status(400).send("Wrong Password");
                }
            }
        })
        .catch(err => {
            res.status(500).send("Internal Server Error: " + err);
        });
});

router.post('/get', (req, res) => {
    User.findOne({username: req.body.username})
        .then(user => {
            if (user == null) {
                res.status(400).send("Not Found");
            } else {
                res.send(user);
            }

        })
        .catch(err => {
            res.status(500).send("Internal Server Error");
        });
});

router.post('/update', (req, res) => {
    User.findOne({username: req.body.username})
        .then(user => {
            if (user == null) {
                res.status(500).send("Not Found");
            } else {
                user.desc = req.body.desc;
                user.save()
                    .then(savedUser => {
                        res.send(savedUser);
                    })
                    .catch(err => {
                        res.status(500).send("Internal Server Error: " + err);
                    });
            }
        })
        .catch(err => {
            res.status(500).send("Internal Server Error");
        });
});

router.post('/authenticate', function (req, res) {
    const {username, password} = req.body;
    User.findOne({username: req.body.username})
        .then(async (user) => {
                if (await comparePassword(req.body.password, password)) {
                    const payload = {username};
                    const token = jwt.sign(payload, process.env.SUPER_SECRET, {
                        expiresIn: '14d' // optional cookie expiration date
                    });
                    return res.cookie('token', token, {httpOnly: true})
                        .status(200).send({username});
                }
                return res.status(400).send("The password does not match");
            }
        ).catch((error) => console.error(`Something went wrong: ${error}`));
});

module.exports = router;