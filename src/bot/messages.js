// bot/messages.js
module.exports = (token) => {
  return `
  📢 *${token.name}*
  🧾 CA: \`${token.contract}\`
  💰 Market Cap: $${token.marketCap}
  💧 Liquidity: $${token.liquidity}
  👤 Dev Holding: ${token.devHold}%
  👑 Top Holder: ${token.topHolder}%
  📦 Bundled: ${token.bundlePct}%
  🕵️ Insiders: ${token.insidersPct}%
  🧍 Total Holders: ${token.holders}
  ⏰ Created: ${token.created.toLocaleTimeString()}
  📊 5M Volume: $${token.volume5m}
  📣 Socials: [Telegram](${token.socials.telegram}) | [X](${
    token.socials.twitter
  })
  `;
};
