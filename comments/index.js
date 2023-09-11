const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(express.json());
app.use(cors());

const COMMENTS_BY_POST_ID = {};

app.get('/posts/:id/comments', (req, res) => {
  const postId = req.params.id;
  res.send(COMMENTS_BY_POST_ID[postId] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { content } = req.body;
  const postId = req.params.id;
  const status = 'pending';

  const comments = COMMENTS_BY_POST_ID[postId] || [];
  const newComment = { id, content, status };

  COMMENTS_BY_POST_ID[postId] = [...comments, newComment];

  await axios.post('http://event-bus-srv:4005/events', {
    type: 'CommentCreated',
    data: { id, content, status, postId },
  });

  res.status(201).send(newComment);
});

app.post('/events', async (req, res) => {
  const { type, data } = req.body;
  const { id, content, status, postId } = data;

  if (type === 'CommentModerated') {
    COMMENTS_BY_POST_ID[postId] = COMMENTS_BY_POST_ID[postId].map((comment) =>
      comment.id === data.id ? { id, content, status } : comment
    );

    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentUpdated',
      data: { id, content, status, postId },
    });
  }

  res.send({});
});

app.listen(4001, () => {
  console.log('Listening on 4001');
});
