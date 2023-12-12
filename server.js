const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const {urlencoded} = require("express");
const userRouter = require('./routes/userRoutes');
const tweetRouter = require('./routes/tweetRoutes');
const feedsRouter = require('./routes/feedsRoutes');
const {dbUrl} = require("./constants");

const app = express();

app.use(cors());
app.use(express.json());
app.use(urlencoded({extended: true}));

app.use('/user', userRouter);
app.use('/tweet', tweetRouter);
app.use('/feeds', feedsRouter);

mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => console.error('Could not connect to MongoDB', err));


app.listen(8080, () => {
    console.log('Server running on port 8080');
});
