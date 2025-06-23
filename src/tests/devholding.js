const { Connection, clusterApiUrl, PublicKey } = require('@solana/web3.js');

// Set your SPL token mint address here
const mintAddress = '2aXMYmyr712npFeyuQBp4LNeKB9u3FMpT7eWKFSN5k9e';

async function getTokenCreatorAndBalance(mintAddress) {
    const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
    const mintPubkey = new PublicKey(mintAddress);

    // Get mint account info (for supply)
    const accountInfo = await connection.getParsedAccountInfo(mintPubkey);
    if (!accountInfo || !accountInfo.value) {
        console.log('Mint address not found.');
        return;
    }

    // Get supply from parsed data
    const supply = accountInfo.value.data.parsed.info.supply;
    const decimals = accountInfo.value.data.parsed.info.decimals;
    const supplyUi = Number(supply) / Math.pow(10, decimals);

    // Get creator (fee payer)
    const signatures = await connection.getSignaturesForAddress(mintPubkey, { limit: 1 });
    if (signatures.length === 0) {
        console.log('No transactions found for this mint.');
        return;
    }

    const tx = await connection.getTransaction(signatures[0].signature, { maxSupportedTransactionVersion: 0 });
    if (!tx) {
        console.log('Transaction not found.');
        return;
    }

    const creator = tx.transaction.message.accountKeys[0].toBase58();
    console.log(`Creator (fee payer) address: ${creator}`);

    // Get all token accounts for the creator for this mint
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        new PublicKey(creator),
        { mint: mintPubkey }
    );

    let totalAmount = 0;
    tokenAccounts.value.forEach((account) => {
        const amount = account.account.data.parsed.info.tokenAmount.uiAmount;
        totalAmount += amount;
    });

    console.log(`Amount of this token owned by creator: ${totalAmount}`);
    console.log(`Total supply: ${supplyUi}`);

    const percent = supplyUi === 0 ? 0 : (totalAmount / supplyUi) * 100;
    console.log(`Percent owned by creator: ${percent.toFixed(4)}%`);
}

getTokenCreatorAndBalance(mintAddress).catch(console.error);