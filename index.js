const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');

const { User, Exercise, createNewUser, getAllUsers, addExercise, findExercise, findUser } = require('./mongoose');


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
  const userObject = await findUser(id);


  res.json({ _id: userObject._id, username: userObject.username, date: date, duration: duration, description: description })

})  




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
