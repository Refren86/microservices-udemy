const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(express.json());
app.use(cors());

const POSTS_WITH_COMMENTS = {};

function handleEvent(type, data) {
  if (type === 'PostCreated') {
    const { id, title } = data;
    POSTS_WITH_COMMENTS[id] = { id, title, comments: [] };
  }

  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data;
    const postComments = POSTS_WITH_COMMENTS[postId].comments;
    postComments.push({ id, content: content, status });

    POSTS_WITH_COMMENTS[postId].comments = postComments;
  }

  if (type === 'CommentUpdated') {
    const { id, content, status, postId } = data;

    POSTS_WITH_COMMENTS[postId].comments = POSTS_WITH_COMMENTS[
      postId
    ].comments.map((comment) =>
      comment.id === id ? { id, content, status } : comment
    );
  }
}

app.get('/posts', (req, res) => {
  res.send(POSTS_WITH_COMMENTS);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;
  handleEvent(type, data);

  console.log('POSTS_WITH_COMMENTS >>>', POSTS_WITH_COMMENTS);

  res.send({});
});

app.listen(4002, async () => {
  console.log('Listening on 4002');

  try {
    const res = await axios.get('http://event-bus-srv:4005/events');

    for (let event of res.data) {
      console.log('Processing event:', event.type);

      handleEvent(event.type, event.data);
    }
  } catch (error) {
    console.log(error.message);
  }
});
