import 'dotenv/config';
import { Wallet, JsonRpcProvider } from 'ethers';
import { V5SignerAdapter } from './web3-utils';

// constants
const HOST = 'https://clob.polymarket.com';
const CHAIN_ID = 137; // Polygon mainnet
const RPC_URL = 'https://poly.api.pocket.network';

async function main() {
  // ✅ ESM-only import done dynamically
  const { ClobClient } = await import('@polymarket/clob-client');

  const provider = new JsonRpcProvider(RPC_URL);

  if (!process.env.PRIVATE_KEY) {
    throw new Error('PRIVATE_KEY is missing');
  }

  const wallet = new Wallet(process.env.PRIVATE_KEY, provider);
  const signer = new V5SignerAdapter(wallet);

  const client = new ClobClient(
    HOST,
    CHAIN_ID,
    signer as any,
  );

  const apiCreds = await client.createOrDeriveApiKey();

  console.log('API credentials:');
  console.log(apiCreds);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
