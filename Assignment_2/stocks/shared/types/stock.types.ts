export interface Stock {
    id: string;
    name: string;
    symbol: string;
    purchase_price: number;
    purchase_date: string;
    shares: number;
}

export interface StockValue {
    symbol: string;
    ticker: number;
    stock_value: number;
}
