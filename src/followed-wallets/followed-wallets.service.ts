import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { FollowedWallet } from './entity/followed-wallet.entity';

@Injectable()
export class FollowedWalletsService {
  private readonly store: FollowedWallet[] = [];

  async findAll(): Promise<FollowedWallet[]> {
    return [...this.store].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  async findActive(): Promise<FollowedWallet[]> {
    return this.store.filter((w) => w.isActive);
  }

  async add(wallet: string, label?: string): Promise<FollowedWallet> {
    const normalized = wallet.trim().toLowerCase();
    if (!normalized) {
      throw new ConflictException('Wallet address is required');
    }

    const existing = this.store.find((w) => w.wallet === normalized);
    if (existing) return existing;

    const now = new Date();
    const newWallet: FollowedWallet = {
      id: crypto.randomUUID(),
      wallet: normalized,
      label: label?.trim() || undefined,
      isActive: true,
      lastTradeId: undefined,
      createdAt: now,
      updatedAt: now,
    };
    this.store.push(newWallet);
    return newWallet;
  }

  async update(
    id: string,
    data: {
      label?: string;
      isActive?: boolean;
      lastTradeId?: string | null;
    },
  ): Promise<FollowedWallet> {
    const wallet = this.store.find((w) => w.id === id);
    if (!wallet) throw new NotFoundException('Followed wallet not found');

    if (data.label !== undefined) wallet.label = data.label?.trim() || undefined;
    if (data.isActive !== undefined) wallet.isActive = data.isActive;
    if (data.lastTradeId !== undefined) {
      wallet.lastTradeId =
        data.lastTradeId === null || data.lastTradeId === '' ? null : data.lastTradeId;
    }
    wallet.updatedAt = new Date();
    return wallet;
  }

  async remove(id: string) {
    const idx = this.store.findIndex((w) => w.id === id);
    if (idx !== -1) this.store.splice(idx, 1);
    return { ok: true };
  }

  async removeByWallet(wallet: string) {
    const normalized = wallet.trim().toLowerCase();
    const idx = this.store.findIndex((w) => w.wallet === normalized);
    if (idx !== -1) this.store.splice(idx, 1);
    return { ok: true };
  }
}
