const { Connection, PublicKey } = require('@solana/web3.js');
const { getMint, TOKEN_PROGRAM_ID } = require('@solana/spl-token');

// Replace with your private RPC endpoint
const RPC_ENDPOINT = 'https://mainnet.helius-rpc.com/?api-key=77aae9b3-ad37-4523-8caf-dea409d5519e';

async function getTopHolder(mintAddress) {
    const connection = new Connection(RPC_ENDPOINT, 'confirmed');
    const mintPubkey = new PublicKey(mintAddress);

    const accounts = await connection.getProgramAccounts(
        TOKEN_PROGRAM_ID,
        {
            filters: [
                { dataSize: 165 },
                { memcmp: { offset: 0, bytes: mintPubkey.toBase58() } }
            ]
        }
    );

    const mintInfo = await getMint(connection, mintPubkey);
    const decimals = mintInfo.decimals;
    const totalSupply = Number(mintInfo.supply) / (10 ** decimals);

    let topHolder = null;
    let topAmount = 0;

    for (const { account } of accounts) {
        const data = account.data;
        const owner = new PublicKey(data.slice(32, 64)).toBase58();
        const amount = Number(
            data.readBigUInt64LE(64)
        ) / (10 ** decimals);

        if (amount > topAmount) {
            topAmount = amount;
            topHolder = owner;
        }
    }

    const percent = ((topAmount / totalSupply) * 100).toFixed(4);

    console.log(`Top Holder Address: ${topHolder}`);
    console.log(`Amount Held: ${topAmount}`);
    console.log(`Percent of Total Supply: ${percent}%`);
}

// Example usage: replace with your token mint address
const mintAddress = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB';
getTopHolder(mintAddress);