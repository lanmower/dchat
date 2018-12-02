const {moment, dapp} = window;
const {appName} = dapp;

// Chat base HTML (without user list and messages)
console.log("APPNAME:"+appName);
document.getElementById('appname').innerHTML = appName;

const scrollDown = (item)=>{
  item.scrollTop = item.scrollHeight - item.clientHeight;
}

// update the number of users on the screen
const updateUserCount = () => {
  //count display elements
  const userCount = document.querySelectorAll('.user-list li').length;
  //set number on display
  document.querySelector('.online-count').innerHTML = userCount;
}

// Add a new user to the list
const addUser = user => {
  const userList = document.querySelector('.user-list');
  const userHTML = window.htmltemplates.user(user);

  // add the user to the list
  if(userList) {
    userList.insertAdjacentHTML('beforeend', userHTML);
    //refresh user count
    updateUserCount()
  }
};

// Renders a new message and finds the user that belongs to the message
const addMessage = message => {
  // get user from message
  const { user = {} } = message;
  const chat = document.querySelector('.chat');
  
  if(!chat)return;
  //get message template
  const messageHTML = window.htmltemplates.message(user, message);
  //add to display
  chat.insertAdjacentHTML( 'beforeend', messageHTML);
  //scroll down
  scrollDown(chat);
};

// Shows the chat page
const showChat = async () => {
  const messages = await dapp.methods.find('messages');
  
  // We want to show the newest message last
  for(let index = messages.length-1; index >=0; index--){
    addMessage(messages[index]);
  }

  // Find all users
  const userList = document.querySelector('.user-list').innerHTML = '';
  const users = await dapp.methods.find('users');
  for(let index in users){
    if(users[index].online) addUser(users[index]);
  }  
};

document.addEventListener('submit', async ev => {
  if(ev.target.id === 'send-message') {
    
    //dont refresh the page
    
    ev.preventDefault();
    const messageInputField = document.querySelector('[name="text"]');
    
    // Create a new message and then clear the input field
    await dapp.methods.create('messages',{
      text: messageInputField.value,
      type: 'message'
    });
    messageInputField.value = '';
  }
});

window.dapp.update = ({service, event, data})=>{
  console.log(service, event, data);
  switch(service) {
    case `dapp.${appName}.messages`:
      if(data.type = 'message') addMessage(data);
      break;
    case `dapp.${appName}.users`:
      if(event == 'created') addUser(data);
      else showChat();
      break;
    default:
      console.log(event);
  }
};

window.dapp.ready=()=>{
  dapp.methods.subscribe('messages');
  dapp.methods.subscribe('users');
  showChat();
}

window.dapp.init();
