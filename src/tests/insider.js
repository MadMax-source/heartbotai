const { Connection, PublicKey } = require('@solana/web3.js');
const { getMint } = require('@solana/spl-token');

const CUSTOM_RPC_URL = 'https://mainnet.helius-rpc.com/?api-key=77aae9b3-ad37-4523-8caf-dea409d5519e';
const mintAddress = 'G6nZYEvhwFxxnp1KZr1v9igXtipuB5zL6oDGNMRZqF3q'; // Replace with your token mint address
//G6nZYEvhwFxxnp1KZr1v9igXtipuB5zL6oDGNMRZqF3q
async function getCreatorWalletAndBalance(mintAddress) {
    const connection = new Connection(CUSTOM_RPC_URL, 'confirmed');
    const mintPubkey = new PublicKey(mintAddress);

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

    let creator;
    if (tx.transaction.message.accountKeys) {
        creator = tx.transaction.message.accountKeys[0].toBase58();
    } else if (tx.transaction.message.staticAccountKeys) {
        creator = tx.transaction.message.staticAccountKeys[0].toBase58();
    } else {
        console.log('Could not determine creator wallet address.');
        return;
    }

    console.log(`Creator/Developer Wallet Address: ${creator}`);

    const creatorPubkey = new PublicKey(creator);
    const tokenAccounts = await connection.getTokenAccountsByOwner(creatorPubkey, { mint: mintPubkey });

    if (tokenAccounts.value.length === 0) {
        console.log('Creator does not own any tokens.');
        return;
    }

    const mintInfo = await getMint(connection, mintPubkey);
    const decimals = mintInfo.decimals;
    const totalSupply = Number(mintInfo.supply) / (10 ** decimals);

    let totalAmount = 0;
    for (const acc of tokenAccounts.value) {
        const data = acc.account.data;
        const amount = Number(data.readBigUInt64LE(64));
        totalAmount += amount;
    }
    const adjustedAmount = totalAmount / (10 ** decimals);

    const percentage = ((adjustedAmount / totalSupply) * 100).toFixed(4);

    console.log(`Amount of tokens owned by Insiders: ${adjustedAmount}`);
    console.log(`Total Supply: ${totalSupply}`);
    console.log(`Percentage owned by Insiders: ${percentage}%`);
}

getCreatorWalletAndBalance(mintAddress);