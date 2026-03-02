export interface PolymarketActivity {
    id: string;
    user: string;
    market: string;
    outcome: string;
    side: "BUY" | "SELL";
    price: number;
    slug: string;
    eventSlug: string;
    size: number;
    timestamp: string;
    type: string;
    conditionId: string
}

export interface ActivityResponse {
    activity: PolymarketActivity[];
}

export declare enum Side {
    BUY = "BUY",
    SELL = "SELL"
}

export interface MakerOrder {
    order_id: string;
    owner: string;
    maker_address: string;
    matched_amount: string;
    price: string;
    fee_rate_bps: string;
    asset_id: string;
    outcome: string;
    side: Side;
}

export interface Trade {
    id: string;
    taker_order_id: string;
    market: string;
    asset_id: string;
    side: Side;
    size: string;
    fee_rate_bps: string;
    price: string;
    status: string;
    match_time: string;
    last_update: string;
    outcome: string;
    bucket_index: number;
    owner: string;
    maker_address: string;
    maker_orders: MakerOrder[];
    transaction_hash: string;
    trader_side: "TAKER" | "MAKER";
}


