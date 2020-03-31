const express = require('express');
const cors = require('cors');
const monk = require('monk'); //to connect to db

const app = express();
const db = monk('localhost/chatter');
const chatters = db.get('chatters');

app.use(cors());
app.use(express.json()); //json body parser

app.get('/', (request, response) => {
  response.json({
    message: "Chatter!"
  });
});

function isValidChatter(chatter)  {// rtype = bool
  return chatter.name && chatter.name.toString().trim() !== '' && chatter.content && chatter.content.toString().trim() !== '';
}

app.post('/chatters', (request, response) => {
  if (isValidChatter(request.body)) {
    const chatter = { //toString (weakily) prevents injection attacks
      name: request.body.name.toString(),
      content: request.body.content.toString(),
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
