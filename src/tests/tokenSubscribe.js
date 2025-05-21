const WebSocket = require("ws"); // For Node.js. In browser, just use `new WebSocket(...)`

// Create WebSocket connection
const ws = new WebSocket("wss://pumpportal.fun/api/data");

ws.on("open", () => {
  console.log("Connected to PumpPortal WebSocket");

  // Subscribe to new token creations
  const payload = {
    method: "subscribeNewToken",
  };

  ws.send(JSON.stringify(payload));
});

ws.on("message", (data) => {
  const event = JSON.parse(data);
  console.log("New Token Event:", event);
});

ws.on("error", (err) => {
  console.error("WebSocket error:", err);
});

ws.on("close", () => {
  console.log("WebSocket connection closed");
});

/*
 node ./src/tests/tokenSubscribe.js
Connected to PumpPortal WebSocket
New Token Event: { message: 'Successfully subscribed to token creation events.' }
New Token Event: {
  signature: '3ovdd1N1zYnK7ffty1BFooPRryXCiHN2YwnbgdFb1UbcqB2SpUFPN7GzP3p6GVor1i7Nunv6qqyBL4dVox7ec7TA',
  mint: '2v5YHf2h5iCysfNP4ob7JY3SVeiH9N791VCRG1Vwpump',
  traderPublicKey: '13iai3A65vKVaYHXXmWscVfwH9mcbUu41ag2EqhieYXo',
  txType: 'create',
  initialBuy: 35411.372207,
  solAmount: 0.000990099,
  bondingCurveKey: 'AQCw1UmWRkDM9LRpR2BnEfBdPbh6Vw1ZvFK2oJeifFWS',
  vTokensInBondingCurve: 1072964588.627793,
  vSolInBondingCurve: 30.000990098999978,
  marketCapSol: 27.960838984787035,
  name: 'Solana’s Step Bro',
  symbol: 'Sexy sol',
  uri: 'https://ipfs.io/ipfs/QmNoCSPoDeYo3PUNzhBuSfcvNSYFGzENVbEkRD925yixSh',
  pool: 'pump'
}

New Token Event: {
  signature: '24VXTXWPvs4j3zynZndA6eZtcJgPuMxdL9DkdstXJnHL73dxBQKtZ5oKwwXxUUTzi64n5AXgC5PnU2vCcxbmjmmC',
  mint: '5JLFQAxFM5kYv2yPtr5s8333ZP2XFhATTDJQBryipump',
  traderPublicKey: 'AUtyr8SV5JBpX7p8fKW5oyrZsejFKkEmtxUdwvFg5AXV',
  txType: 'create',
  initialBuy: 57003124.97333,
  solAmount: 1.683168316,
  bondingCurveKey: '4jSGeqsi6Muavp1Y2fXmmefR9Nv48XQKJVYoDNdJUetx',
  vTokensInBondingCurve: 1015996875.02667,
  vSolInBondingCurve: 31.683168316,
  marketCapSol: 31.184316698974406,
  name: 'Pump Trench Rooms',
  symbol: 'PTR',
  uri: 'https://ipfs.io/ipfs/QmYYvKdxYuz3Ng1zZaKfXRDvxVpckbsFDkKBhDKCLc9hp9',
  pool: 'pump'
}
New Token Event: {
  signature: '25g3dmtAYJVTmSB8Wfw6aUunH3TbcFC3SwsQoGacyJpXnkbs7TigschgpZFewh2NDFHT86tbxsEVXCum4jfMtjrM',
  mint: '6u9M6dhBqfABcVoNoyDdqxX2Q29QBMo42Wv1XLWgpump',
  traderPublicKey: '9K98pYECeRVUQEftHvUP9FiXqXFKamocxhCMdPbVQQ2h',
  txType: 'create',
  initialBuy: 67062499.999999,
  solAmount: 2,
  bondingCurveKey: 'FZiNVQJbwGLM37i3njqhVR9c1R6UX37j3JcHokWSLR4J',
  vTokensInBondingCurve: 1005937500.000001,
  vSolInBondingCurve: 31.999999999999968,
  marketCapSol: 31.811121466293816,
  name: '520',
  symbol: '520',
  uri: 'https://ipfs.io/ipfs/QmUiZGmkuVdpMgk6PQaVfDAcuChTqBYQRon2z9UA5bBw76',
  pool: 'pump'
}
*/
