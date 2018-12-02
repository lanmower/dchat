const express = require('express');
const app = express();
const io = require( 'socket.io-client');
const socket = io('https://dconnect.glitch.me/');
const feathers = require('@feathersjs/client');
const dapp = feathers();
dapp.configure(feathers.socketio(socket));
require('./dconnect.js');

app.use(express.static('public'));
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

const steem = require('steem');
//THIS IS THE BOT, IF YOU SAY PING IT SAYS PONG
const authenticated = function(message, data) {
  dapp.service('dapp.dchat.messages').on('created', (data)=>{
    if(data.type=='message') {
      if(data.text=='apps') {
      steem.api.getAccountHistoryAsync('dconnect', -1 ,1000).then(
        (hist)=>{
          const rooms = [];
          for(const index in hist) {
            const transferOp = hist[index][1].op;
            if(transferOp[0] =='transfer' && transferOp[1].memo.split(':').length > 2 && transferOp[1].memo.startsWith('ROOM:') && parseFloat(transferOp[1].amount.split(' ')[0]) >= 0.001) {
              const room = transferOp[1].memo;
              const split = room.split(':');
              const name = split[1];
              rooms.push(name);
            }
          } 
          dapp.service('dapp.dchat.messages').create({
            event: 'message',
            text: rooms.join()
          });
        }
      ).catch(console.error);
      }
    }
  });
}
//LOG IN BOT, CREDENTIALS GO INTO .env
global.getCredentials(process.env.USERNAME, process.env.SECRET).then((credentials)=>{
  const payload = Object.assign({ strategy: 'local' }, credentials);
  dapp.configure(feathers.authentication(payload));
  console.log(payload);
  socket.emit('authenticate', payload, authenticated);
});

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
