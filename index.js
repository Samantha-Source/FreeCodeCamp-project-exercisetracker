const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');
/*
// const mongoose = require('mongoose');
// const mongoURI = process.env.MONGO_URI;
// const { ObjectId } = require('mongodb');

// mongoose.connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true});

// const exererciseSchema = new mongoose.Schema({
//   description: String,
//   duration: Number,
//   date: String,
//   user: {
//     type: mongoose.Schema.ObjectId, 
//     ref: 'User'
//   }
// })

// const userSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: true
//   },
//   count: {
//     type: Number,
//     default: 0,
//   },
//   log: [{type: mongoose.Schema.ObjectId, ref: 'Exercise'}]
// })

// let User = mongoose.model('User', userSchema);
// let Exercise = mongoose.model('Exercise', exererciseSchema);
*/

const { User, Exercise, createNewUser } = require('./mongoose');


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});



app.route('/api/users')
  .post((req, res, next) => {
    const { username } = req.body;
    // console.log(username);
    createNewUser(username);
  })




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
