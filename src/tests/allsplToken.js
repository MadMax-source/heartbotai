const { TokenListProvider } = require('@solana/token-registry');

(async () => {
  try {
    const tokens = await new TokenListProvider().resolve();
    const tokenList = tokens.filterByChainId(101).getList(); // 101 is mainnet-beta

    console.log(`Total tokens: ${tokenList.length}`);
    tokenList.forEach(token => {
      console.log(`Name: ${token.name}`);
      console.log(`Symbol: ${token.symbol}`);
      console.log(`Mint Address: ${token.address}`);
      console.log('----------------------------------------');
    });
  } catch (error) {
    console.error('Error fetching SPL tokens:', error);
  }
})();
