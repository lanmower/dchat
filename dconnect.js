/* 
DCONNECT FOR NPM 
*/
const md5 = require('md5');
const https = require('https');
const steem = require('steem');
const nacl = require('tweetnacl'); 
const naclUtil = require('tweetnacl-util'); 
const sign = function(username, password) {
  const keys = nacl.sign.keyPair.fromSeed(naclUtil.decodeUTF8(md5(username+':dconnect:'+password)));
  const signature = nacl.sign.detached(naclUtil.decodeUTF8(username), keys.secretKey);
  return naclUtil.encodeBase64(signature);
};
const steemuser = (name) => {
  return new Promise(resolve =>{
    const body = JSON.stringify({name});
    let responsetext = '';
    var request = new https.request({
        hostname: "dconnect.glitch.me",
        port: 443,
        path: "/steemuser",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(body)
        }
    }, (res) => {
      res.resume();
      res.on('data', function (chunk) {
          responsetext+=chunk;
          console.log('Response: ', chunk);
      });
      res.on('end', () => {
        console.log(body);
        if (!res.complete) {
          console.error(
            'The connection was terminated while the message was still being sent');
        } else {
          resolve(JSON.parse(responsetext));
        }
      });
    });
    request.on('error', (e) => {
      console.error(`problem with request: ${e.message}`);
    });
    request.write(body);
    request.end();
  });
}

global.getCredentials = async (inputuser, password) => {
  const username = (await steemuser(inputuser)).user;
  const user = {
    username:'SIGNIN:'+username,
    password: md5(username+':asterisk:'+process.env.SECRET)
  };

  return user;
};

