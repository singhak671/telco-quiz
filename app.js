const express = require('express');
const bodyParser = require('body-parser')
const logger = require('morgan')
const mongoose = require('mongoose');
const app = express();
app.use(logger('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/api',require('./route/customerRoute'));
mongoose.connect('mongodb://localhost/telcoQuiz', (err, connect) => {
    if (err) {
        console.log('Db not connected !!')
    } else {
        console.log('Db connected');
    }
})
app.listen(2000, () => {
    console.log('server is running on port : 2000');
})
