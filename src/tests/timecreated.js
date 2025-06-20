const { Connection, clusterApiUrl, PublicKey } = require('@solana/web3.js');

async function getTokenCreationTime(mintAddress) {
  const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
  const mintPubkey = new PublicKey(mintAddress);

  // Fetch signatures for the mint address (limit 1, oldest first)
  const signatures = await connection.getSignaturesForAddress(mintPubkey, { limit: 1, before: undefined, until: undefined });

  if (signatures.length === 0) {
    console.log('No transactions found for this mint address.');
    return;
  }

  const firstSignature = signatures[signatures.length - 1].signature;
  const tx = await connection.getTransaction(firstSignature, { maxSupportedTransactionVersion: 0 });

  if (!tx || !tx.blockTime) {
    console.log('Could not fetch transaction or block time.');
    return;
  }

  const creationDate = new Date(tx.blockTime * 1000);
  console.log(`Token created at: ${creationDate.toUTCString()} (Unix: ${tx.blockTime})`);
}

// Example usage:
const mintAddress = "HGDcqWvB3T4YPp4K9aQkRJiYEvgZM7XuDo7SFPYg1g4r"
getTokenCreationTime(mintAddress);