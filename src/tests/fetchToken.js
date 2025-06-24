const fetch = require('node-fetch');
const { Connection, clusterApiUrl, PublicKey } = require('@solana/web3.js');
const { getMint } = require('@solana/spl-token');

const CUSTOM_RPC_URL = 'https://mainnet.helius-rpc.com/?api-key=77aae9b3-ad37-4523-8caf-dea409d5519e';

async function fetchSolanaTokens() {
    const url = 'https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json';
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.tokens;
}

async function fetchMarketCapAndVolume(coingeckoId) {
    if (!coingeckoId) return { market_cap: null, volume_24h: null };
    const url = `https://api.coingecko.com/api/v3/coins/${coingeckoId}`;
    const response = await fetch(url);
    if (!response.ok) return { market_cap: null, volume_24h: null };
    const data = await response.json();
    return {
        market_cap: data.market_data?.market_cap?.usd || null,
        volume_24h: data.market_data?.total_volume?.usd || null
    };
}

async function getCreatorHoldingPercent(mintAddress) {
    try {
        const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
        const mintPubkey = new PublicKey(mintAddress);

        // Get mint account info (for supply)
        const accountInfo = await connection.getParsedAccountInfo(mintPubkey);
        if (!accountInfo || !accountInfo.value) return { creator: null, dev_holding_percent: null };

        const supply = accountInfo.value.data.parsed.info.supply;
        const decimals = accountInfo.value.data.parsed.info.decimals;
        const supplyUi = Number(supply) / Math.pow(10, decimals);

        // Get creator (fee payer)
        const signatures = await connection.getSignaturesForAddress(mintPubkey, { limit: 1 });
        if (signatures.length === 0) return { creator: null, dev_holding_percent: null };

        const tx = await connection.getTransaction(signatures[0].signature, { maxSupportedTransactionVersion: 0 });
        if (!tx) return { creator: null, dev_holding_percent: null };

        const creator = tx.transaction.message.accountKeys[0].toBase58();

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

        const percent = supplyUi === 0 ? 0 : (totalAmount / supplyUi) * 100;
        return { creator, dev_holding_percent: percent.toFixed(4) };
    } catch (e) {
        return { creator: null, dev_holding_percent: null };
    }
}

async function getTotalHolders(mintAddress) {
    try {
        const connection = new Connection(CUSTOM_RPC_URL, 'confirmed');
        const mintPubkey = new PublicKey(mintAddress);
        const accounts = await connection.getTokenLargestAccounts(mintPubkey);
        if (!accounts || !accounts.value) return null;
        // Only accounts with non-zero balance are returned
        return accounts.value.length;
    } catch (e) {
        return null;
    }
}

async function getTokenCreationTime(mintAddress) {
    try {
        const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
        const mintPubkey = new PublicKey(mintAddress);

        // Fetch signatures for the mint address (limit 1, oldest first)
        const signatures = await connection.getSignaturesForAddress(mintPubkey, { limit: 1, before: undefined, until: undefined });
        if (signatures.length === 0) return null;

        const firstSignature = signatures[signatures.length - 1].signature;
        const tx = await connection.getTransaction(firstSignature, { maxSupportedTransactionVersion: 0 });
        if (!tx || !tx.blockTime) return null;

        const creationDate = new Date(tx.blockTime * 1000);
        return creationDate.toUTCString();
    } catch (e) {
        return null;
    }
}

// --- INSIDER FUNCTION ---
async function getInsiderHolding(mintAddress) {
    try {
        const connection = new Connection(CUSTOM_RPC_URL, 'confirmed');
        const mintPubkey = new PublicKey(mintAddress);

        // Get creator address from first transaction
        const signatures = await connection.getSignaturesForAddress(mintPubkey, { limit: 1 });
        if (signatures.length === 0) return { insider_address: null, insider_amount: null, insider_percent: null };

        const tx = await connection.getTransaction(signatures[0].signature, { maxSupportedTransactionVersion: 0 });
        if (!tx) return { insider_address: null, insider_amount: null, insider_percent: null };

        let creator;
        if (tx.transaction.message.accountKeys) {
            creator = tx.transaction.message.accountKeys[0].toBase58();
        } else if (tx.transaction.message.staticAccountKeys) {
            creator = tx.transaction.message.staticAccountKeys[0].toBase58();
        } else {
            return { insider_address: null, insider_amount: null, insider_percent: null };
        }

        const creatorPubkey = new PublicKey(creator);
        const tokenAccounts = await connection.getTokenAccountsByOwner(creatorPubkey, { mint: mintPubkey });

        if (tokenAccounts.value.length === 0) {
            return { insider_address: creator, insider_amount: 0, insider_percent: "0.0000" };
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
        const percentage = totalSupply === 0 ? "0.0000" : ((adjustedAmount / totalSupply) * 100).toFixed(4);

        return {
            insider_address: creator,
            insider_amount: adjustedAmount,
            insider_percent: percentage
        };
    } catch (e) {
        return { insider_address: null, insider_amount: null, insider_percent: null };
    }
}

// --- SOCIALS FUNCTION ---
async function hasSocials(tokenMint) {
    try {
        const url = `https://public-api.solscan.io/token/meta?tokenAddress=${tokenMint}`;
        const response = await fetch(url);
        if (!response.ok) return false;
        const data = await response.json();

        // Check for social fields
        const socials = [
            data?.twitter,
            data?.telegram,
            data?.discord,
            data?.website
        ];
        // Return true if at least one is present and non-empty
        return socials.some(link => link && link.trim() !== '');
    } catch (e) {
        return false;
    }
}

async function main() {
    const tokens = await fetchSolanaTokens();
    console.log(`Fetched ${tokens.length} tokens.`);
    // Limit to first 5 tokens for demo (remove .slice(0, 5) to process all)
    const sampleTokens = tokens.slice(110, 119);

    for (const token of sampleTokens) {
        const { market_cap, volume_24h } = await fetchMarketCapAndVolume(token.extensions?.coingeckoId);
        const { creator, dev_holding_percent } = await getCreatorHoldingPercent(token.address);
        const total_holders = await getTotalHolders(token.address);
        const time_created = await getTokenCreationTime(token.address);
        const { insider_address, insider_amount, insider_percent } = await getInsiderHolding(token.address);
        const has_socials = await hasSocials(token.address);

        console.log({
            name: token.name,
            symbol: token.symbol,
            address: token.address,
            coingeckoId: token.extensions?.coingeckoId || null,
            market_cap,
            volume_24h,
            creator_address: creator,
            dev_holding_percent,
            total_holders,
            time_created,
            insider_address,
            insider_amount,
            insider_percent,
            has_socials
        });
    }
}

main().catch(err => {
    console.error('Error:', err);
});


