console.log("TEST");
const form = document.querySelector('form');
const loadingE = document.querySelector('.loading');
const loadMoreElement = document.querySelector('#loadMore');
const chattersElement = document.querySelector('.chatters');
const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000/chatters' : 'https://chatter-api.now.sh/chatters';

loadingE.style.display = '';

let skip = 0;
let limit = 5;
let loading = false;
let finished = false;

document.addEventListener('scroll', () => {
  const rect = loadMoreElement.getBoundingClientRect();
  if (rect.top < window.innerHeight && !loading && !finished) {
    loadMore();
  }
});

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
  loadingE.style.display = '';

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
      loadingE.style.display = 'none';
    });
});

function loadMore() {
  skip += limit;
  listAllChatters(false);
}

function listAllChatters(reset = true) { //GET all chatters
  loading = true;
  if (reset) {
    chattersElement.innerHTML = '';
    skip = 0;
    finished = false;
  }

  fetch(`${API_URL}?skip=${skip}&limit=${limit}`)
    .then(response => response.json())
    .then(result => {
      result.chatters.forEach(chatter => {
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
      loadingE.style.display = 'none';
      if (!result.meta.has_more) {
        loadMoreElement.style.visibility = 'hidden';
        finished = true;
      } else {
        loadMoreElement.style.visibility = 'visible';
      }
      loading = false;
    });
}
