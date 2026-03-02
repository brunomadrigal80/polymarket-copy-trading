import 'dotenv/config';
import { Wallet, JsonRpcProvider } from 'ethers';
import { V5SignerAdapter } from 'src/utils/web3-utils';

const HOST = 'https://clob.polymarket.com';
const CHAIN_ID = 137;
const RPC_URL = 'https://poly.api.pocket.network';

const apiCreds = {
  key: 'e51ce9d8-91c5-bb31-c6cb-e58822195925',
  secret: 'kRphxOZl_bAsCH-xTHzbpl-EUgI25VkmRnrgFemHWaQ=',
  passphrase: 'c661cab9091301287a7fdae43f5c40547ac0c4caf00c127167d1130f0fa77a92',
};

export async function createClobClient() {
  // ✅ ESM-only lib loaded safely
  const { ClobClient } = await import('@polymarket/clob-client');

  const provider = new JsonRpcProvider(RPC_URL);

  const wallet = new Wallet(
    process.env.PRIVATE_KEY as string,
    provider,
  );

  const signer = new V5SignerAdapter(wallet);

  return new ClobClient(
    HOST,
    CHAIN_ID,
    signer as any,
    apiCreds,
    2,
    process.env.FUNDER_ADDRESS,
  );
}
