import { Injectable, Logger } from '@nestjs/common';
import { Wallet, JsonRpcProvider } from 'ethers';
import { V5SignerAdapter } from '../utils/web3-utils';

@Injectable()
export class PolymarketClient {
  private readonly logger = new Logger(PolymarketClient.name);
  private clientPromise: Promise<any> | null = null;

  private async createClient() {
    const { ClobClient } = await import('@polymarket/clob-client');

    const privateKey = process.env.PRIVATE_KEY?.trim();
    if (!privateKey || privateKey.startsWith('0xyour') || privateKey.includes('...')) {
      throw new Error(
        'Invalid or placeholder PRIVATE_KEY in .env. Set a real wallet private key to place orders.',
      );
    }

    const provider = new JsonRpcProvider(process.env.RPC_URL!);
    const wallet = new Wallet(privateKey, provider);
    const signer = new V5SignerAdapter(wallet);

    return new ClobClient(
      'https://clob.polymarket.com',
      137,
      signer as any,
      JSON.parse(process.env.POLYMARKET_API_CREDS!),
      2,
      process.env.FUNDER_ADDRESS,
    );
  }

  async getClient() {
    if (!this.clientPromise) {
      this.clientPromise = this.createClient().catch((err) => {
        this.clientPromise = null;
        this.logger.warn(err.message);
        throw err;
      });
    }
    return this.clientPromise;
  }
}
