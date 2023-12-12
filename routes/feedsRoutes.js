const {User} = require("../schema/user");
const {Tweet} = require("../schema/tweet");
const {Router} = require("express");
const router = Router();

router.post('/get', (req, res) => {
    User.findOne({username: req.body.username})
        .then(user => {
            let followings = user['following']
            let tweetsPromise = [];

            for (let i = 0; i < followings.length; i++) {
                let promise = Tweet.find({username: followings[i]})
                tweetsPromise.push(promise)
            }

            let promise = Tweet.find({username: req.body.username})
            tweetsPromise.push(promise)

            return Promise.all(tweetsPromise);
        }).then((results) => {

        let resp = [].concat.apply([], results)
        res.send(resp);

    }).catch(err => {
        res.status(500).send("Internal Server Error");

    });
});


module.exports = router;