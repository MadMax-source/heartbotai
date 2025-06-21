const { Connection, PublicKey } = require('@solana/web3.js');
const { getMint } = require('@solana/spl-token');

const CUSTOM_RPC_URL = 'https://mainnet.helius-rpc.com/?api-key=77aae9b3-ad37-4523-8caf-dea409d5519e'; // Replace with your endpoint

const mintAddress = '6HbQGGaXUkgxauW1HJNzHAuRAhKSXPzhhWcrAC7uJEpD';

async function getTopHolder(mintAddress) {
    const connection = new Connection(CUSTOM_RPC_URL, 'confirmed');
    const mintPubkey = new PublicKey(mintAddress);

    const accounts = await connection.getTokenLargestAccounts(mintPubkey);
    if (!accounts || !accounts.value || accounts.value.length === 0) {
        console.log('No holders found for this token.');
        return;
    }

    const mintInfo = await getMint(connection, mintPubkey);
    const totalSupply = Number(mintInfo.supply) / (10 ** mintInfo.decimals);

    const topAccount = accounts.value[0];
    const topHolderAddress = topAccount.address.toBase58();
    const amount = topAccount.uiAmount;
    const percentage = ((amount / totalSupply) * 100).toFixed(4);

    console.log(`Top Holder Address: ${topHolderAddress}`);
    console.log(`Amount Held: ${amount}`);
    console.log(`Total Supply: ${totalSupply}`);
    console.log(`Percentage Held: ${percentage}%`);
}

getTopHolder(mintAddress);