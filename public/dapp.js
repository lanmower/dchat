window.getSubdomain=(hostname) =>{
        var regexParse = new RegExp('[a-z\-0-9]{2,63}\.[a-z\.]{2,5}$');
        var urlParts = regexParse.exec(hostname);
        return hostname.replace(urlParts[0],'').slice(0, -1);
}
async function connect(update) {
  try {
    const client = await window.Penpal.connectToParent({methods:{update}})
    const promise = client.promise;
    return promise;
  } catch(e) {
    window.location = "https://dconnect.glitch.me/?a="+window.getSubdomain(window.location.hostname)
  }
}

window.dapp = {
  ready:()=>{
  },
  appName:window.getSubdomain(window.location.hostname),
  init: async function initDapp() {
    await connect(window.dapp.update.bind(this)).then(methods=>{
      window.dapp.methods = methods
      window.dapp.ready();
    });
  }
};

