window.htmltemplates = {
  message: (user, message)=>{
    const filterElement = document.createElement('div');
    filterElement.textContent = message.text;
    const text = filterElement.innerHTML;
    console.log(user);
    return `
    <div class="message flex flex-row">
      <img src="${user.avatar}" alt="${user.username}" class="avatar">
      <div class="message-wrapper">
        <p class="message-header">
          <span class="username font-600">${user.nick?'<img style="width:16px; margin-right:5px" src="https://cdn.discordapp.com/emojis/412236099725950978.png"/>'+user.nick:'anonymous'}</span>
          <span class="sent-date font-300">${window.moment(message.createdAt).format('MMM Do, hh:mm:ss')}</span>
        </p>
        <p class="message-content font-300">${text}</p>
      </div>
    </div>
  `},
  user: (user)=>{
    const steembadge = (user.steemnames)?'<img style="width:16px; margin-right:5px" src="https://cdn.discordapp.com/emojis/412236099725950978.png"/>':'';
    const usernameHTML = steembadge+user.nick;
    console.log(user, usernameHTML, user.steemnames);
    return `
    <li>
      <a class="block relative" href="#">
        <img src="${user.avatar}" alt="" class="avatar">
        <span class="absolute username">
        ${usernameHTML}
        </span>
      </a>
    </li>`;
  },
  
}