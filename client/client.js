console.log("TEST");
const form = document.querySelector('form');
const loading = document.querySelector('.loading');
const API_URL = 'http://localhost:5000/chatters';

loading.style.display = 'none';

form.addEventListener('submit',(event) => {
  event.preventDefault(); //Don't go anywhere
  const formData = new FormData(form);
  const name = formData.get('name');
  const content = formData.get('content');

  const chatter = {
    name,
    content
  };

  form.style.display = 'none';
  loading.style.display = '';

  fetch(API_URL, { //send form data to backend
    method: 'POST',
    body: JSON.stringify(chatter),
    headers: {
      'content-type': 'application/json'
    }
  }).then(response => response.json())
    .then(createdChatter => {
    console.log(createdChatter);
    });
});
