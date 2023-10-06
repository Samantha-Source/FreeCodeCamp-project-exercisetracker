const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');

const { 
  User, 
  Exercise, 
  createNewUser, 
  getAllUsers, 
  addExercise, 
  findExercise, 
  findUser,
  getUserExercises, 
} = require('./mongoose');


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get('/api/deleteall', async (req, res, next) => {
  try {
    const exercisesDeleted = await Exercise.deleteMany({});
    const usersDeleted = await User.deleteMany({});
    res.json({users: usersDeleted.deletedCount, exercises: exercisesDeleted.deletedCount});
  } catch (err) {
    console.error(err);
  }
})


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
  const date = req.body.date 
    ? new Date(req.body.date.replace(/-/g, '\/')).toDateString()
    : new Date().toDateString(); 

  const newExercise = new Exercise({
    description: description,
    duration: duration,
    date: date,
    user: id,
  });
  const result = await addExercise(newExercise);
  const { _id, username, log } = result;
  const currentExercise = await findExercise(log[log.length - 1]);

  res.json({ _id: _id, username: username, date: currentExercise.date, duration: currentExercise.duration, description: currentExercise.description });
})  

app.get('/api/users/:_id/logs', async (req, res, next) => {
  const userId = req.params._id;
  const user = await findUser(userId);
  const { _id, username, log, __v } = user;
  const exercises = await getUserExercises(_id);
  console.log(exercises);
  
  res.json({ username: username, count: __v, _id: _id, log: exercises });
})




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
