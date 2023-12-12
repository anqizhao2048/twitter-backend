const {Tweet} = require("../schema/tweet");
const {User} = require("../schema/user");
const {Router} = require("express");
const router = Router();

router.post('/getForUser', (req, res) => {
    Tweet.find({username: req.body.username})
        .then(tweets => {
            res.send(tweets);
        })
        .catch(err => {
            res.status(500).send("Internal Server Error");
        });
});

router.post('/getAll', (req, res) => {
    Tweet.find()
        .then(tweets => {
            res.send(tweets);
        })
        .catch(err => {
            res.status(500).send("Internal Server Error");
        });
});

router.post('/create', (req, res) => {
    User.findOne({username: req.body.username})
        .then(user => {
            if (user == null) {
                res.status(500).send("User Not Found");
            } else {
                let tweet = new Tweet({
                    username: req.body.username,
                    text: req.body.text,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                });

                tweet.save()
                    .then(savedTweet => {
                        res.send(savedTweet);
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

router.post('/update', (req, res) => {
    Tweet.findById(req.body.id)
        .then(tweet => {
            if (tweet == null) {
                res.status(500).send("Tweet Not Found");
            } else {
                tweet.text = req.body.text;
                tweet.updatedAt = Date.now();

                tweet.save()
                    .then(savedTweet => {
                        res.send(savedTweet);
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

router.post('/delete', (req, res) => {
    Tweet.findById(req.body.id)
        .then(tweet => {
            if (tweet == null) {
                res.status(500).send("Tweet Not Found");
            } else {
                Tweet.deleteOne({_id: req.body.id})
                    .then(tweet => {
                        res.send(req.body.id);
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

module.exports = router;