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

const { User, Exercise, createNewUser, getAllUsers, addExercise } = require('./mongoose');


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});



app.route('/api/users')
  .post(async (req, res, _next) => {
    const { username } = req.body;
    const response = await createNewUser(username);
    res.json({ username: response.username, _id: response._id})
  })
  .get(async (_req, res, _next) => {
    const allUsers = await getAllUsers();
    res.json(allUsers);
  })

app.post('/api/users/:_id/exercises', async (req, res, next) => {
  const id = req.params._id;
  const { description, duration } = req.body;
  const date = req.body.date ? new Date(Date.parse(req.body.date)).toDateString() : new Date().toDateString(); 

  // console.log(id, description, duration, date);
  const newExercise = new Exercise({
    description: description,
    duration: duration,
    date: date,
    user: id,
  });
  const result = await addExercise(newExercise);
  console.log(result);
})  




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
