// services/pumpfun.js
const EventEmitter = require("events");
const emitter = new EventEmitter();

// Replace with actual WebSocket or API
setInterval(() => {
  const mockToken = {
    name: "TEST",
    contract: "0x123...",
    marketCap: Math.floor(Math.random() * 100000),
    liquidity: 5000,
    devHold: 10,
    holders: 150,
    created: new Date(),
    topHolder: 20,
    bundlePct: 5,
    insidersPct: 3,
    volume5m: 1200,
    socials: {
      telegram: "https://t.me/test",
      twitter: "https://x.com/test",
    },
  };
  emitter.emit("token", mockToken);
}, 3000); // every 3s

module.exports = {
  onNewToken: (cb) => emitter.on("token", cb),
};
