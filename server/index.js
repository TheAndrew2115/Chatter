const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json()); //json body parser

app.get('/', (request, response) => {
  response.json({
    message: "Chatter!"
  });
});

app.post('/chatters', (request, response) => {
  console.log(request.body);
});

app.listen(5000, () => {
  console.log("listening on http://localhost:5000");
});
