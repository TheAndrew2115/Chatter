console.log("TEST");
const form = document.querySelector('form');
const loading = document.querySelector('.loading');
const chattersElement = document.querySelector('.chatters');
const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000/chatters' : 'https://chatter-api.now.sh/chatters';

loading.style.display = '';

listAllChatters();

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
      form.reset();
      setTimeout(() => {
        form.style.display='';
      }, 25000); //wait 25 seconds before displaying form again
      listAllChatters();
      loading.style.display = 'none';
    });
});

function listAllChatters() { //GET all chatters
  chattersElement.innerHTML = '';
  fetch(API_URL)
    .then(response => response.json())
    .then(chatters => {
      console.log(chatters);
      chatters.reverse();
      chatters.forEach(chatter => {
        const div = document.createElement('div');
        div.className = "posts";

        const header = document.createElement('h3');
        header.textContent = chatter.name;
        header.className = "headers";

        const contents = document.createElement('p');
        contents.textContent = chatter.content;
        contents.className = "contents";

        const date = document.createElement('small');
        date.textContent = new Date(chatter.created);
        date.className = "dates";

        div.appendChild(header);
        div.appendChild(contents);
        div.appendChild(date);

        chattersElement.appendChild(div);
      });
      loading.style.display = 'none';
    });
}
