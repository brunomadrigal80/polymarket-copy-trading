import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

const DATA_API_ACTIVITY = 'https://data-api.polymarket.com/activity';

/** One activity item from Polymarket Data API (matches "most recent activities" format) */
export interface PolymarketActivityItem {
  proxyWallet: string;
  timestamp: number;
  conditionId: string;
  type: string;
  size: number;
  usdcSize: number;
  transactionHash: string;
  price: number;
  asset: string;
  side: string;
  outcomeIndex: number;
  title: string;
  slug: string;
  icon: string;
  eventSlug: string;
  outcome: string;
  name: string;
  pseudonym: string;
  bio: string;
  profileImage: string;
  profileImageOptimized: string;
  [key: string]: unknown;
}

@Injectable()
export class PolymarketService {
  async getProxyWallet(username: string): Promise<string | null> {
    const url = `https://polymarket.com/@${username}`;

    const { data: html } = await axios.get(url, {
      headers: {
        // Important to avoid bot blocking
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const $ = cheerio.load(html);

    const nextDataRaw = $('#__NEXT_DATA__').html();
    if (!nextDataRaw) {
      throw new InternalServerErrorException('__NEXT_DATA__ not found');
    }

    let nextData: any;
    try {
      nextData = JSON.parse(nextDataRaw);
    } catch {
      throw new InternalServerErrorException('Failed to parse __NEXT_DATA__');
    }

    const queries =
      nextData?.props?.pageProps?.dehydratedState?.queries;

    if (!Array.isArray(queries)) return null;

    for (const q of queries) {
      const proxyWallet = q?.state?.data?.proxyWallet;
      if (proxyWallet) {
        return proxyWallet;
      }
    }

    return null;
  }

  /**
   * Fetch user activity from Polymarket Data API (same as "most recent activities").
   * Use this for activity feed; CLOB getTrades is a different dataset (order-book matches only).
   */
  async getActivity(proxyWallet: string, limit = 20): Promise<PolymarketActivityItem[]> {
    const { data } = await axios.get<PolymarketActivityItem[]>(DATA_API_ACTIVITY, {
      params: { user: proxyWallet, limit },
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CTB/1.0)' },
    });
    return Array.isArray(data) ? data : [];
  }
}
