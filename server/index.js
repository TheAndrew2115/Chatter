const express = require('express');
const cors = require('cors');
const monk = require('monk'); //to connect to db
const Filter = require('bad-words');
const rateLimit = require('express-rate-limit');

const app = express();

const db = monk(process.env.MONGO_URI || 'localhost/chatter');
const chatters = db.get('chatters');
const filter = new Filter();

app.use(cors());
app.use(express.json()); //json body parser

app.get('/', (request, response) => {
  response.json({
    message: "Chatter!"
  });
});

app.get('/chatters', (request, response) => {
  chatters
    .find()
    .then(chatters => {
      response.json(chatters);
    });
});

function isValidChatter(chatter)  {// rtype = bool
  return chatter.name && chatter.name.toString().trim() !== '' && chatter.content && chatter.content.toString().trim() !== '';
}

app.use(rateLimit({ //Every 25 sec, user is limited to 1 post
  windowMs: 25 * 1000, // Only code below is affected by rateLimit
  max: 1
}));

app.post('/chatters', (request, response) => {
  if (isValidChatter(request.body)) {
    const chatter = { //toString (weakily) prevents injection attacks
      name: filter.clean(request.body.name.toString()),
      content: filter.clean(request.body.content.toString()),
      created: new Date()
    };

    chatters //insert into db
      .insert(chatter)
      .then(createdChatter => {
        response.json(createdChatter);
      });

    console.log(chatter);
  } else {
    response.status(422);
    response.json({
      message: "Name and content are required!"
    });
  }
});

app.listen(5000, () => {
  console.log("listening on http://localhost:5000");
});
