const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json());

const EVENTS = [];

app.get('/events', (req, res) => {
  res.send(EVENTS);
})

app.post('/events', (req, res) => {
  const event = req.body;

  EVENTS.push(event);

  // POSTS
  axios.post('http://localhost:4000/events', event).catch((err) => {
    console.log(err.message);
  });
  // COMMENTS
  axios.post('http://localhost:4001/events', event).catch((err) => {
    console.log(err.message);
  });
  // QUERY
  axios.post('http://localhost:4002/events', event).catch((err) => {
    console.log(err.message);
  });
  // MODERATION
  axios.post('http://localhost:4003/events', event).catch((err) => {
    console.log(err.message);
  });

  res.send({ message: 'OK' });
});

app.listen(4005, () => {
  console.log('Listening on 4005');
});
