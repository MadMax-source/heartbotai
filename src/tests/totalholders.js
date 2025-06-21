const { Connection, PublicKey } = require('@solana/web3.js');

const CUSTOM_RPC_URL = 'https://mainnet.helius-rpc.com/?api-key=77aae9b3-ad37-4523-8caf-dea409d5519e';
const mintAddress = 'Esv9YFzHbP38TXTUAhWNz7fWJUDtTcaLMkQypoZAPWSF'; // Replace with your token mint address

async function getHoldersCount(mintAddress) {
    const connection = new Connection(CUSTOM_RPC_URL, 'confirmed');
    const mintPubkey = new PublicKey(mintAddress);

    const tokenAccounts = await connection.getTokenLargestAccounts(mintPubkey);

    if (!tokenAccounts || !tokenAccounts.value || tokenAccounts.value.length === 0) {
        console.log('No holders found for this token.');
        return;
    }

    const nonZeroAccounts = tokenAccounts.value.filter(acc => acc.uiAmount > 0);

    console.log(`Total number of holders: ${nonZeroAccounts.length}`);
}

getHoldersCount(mintAddress);