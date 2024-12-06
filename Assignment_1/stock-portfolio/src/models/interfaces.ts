export interface Stock {
    id: string;
    name: string;
    symbol: string;
    purchase_price: number;
    purchase_date: string;
    shares: number;
}

export interface StockCreationDTO {
    symbol: string;
    purchase_price: number;
    shares: number;
    name?: string;
    purchase_date?: string;
}

export interface StockValue {
    symbol: string;
    ticker: number;
    stock_value: number;
}

export interface PortfolioValue {
    date: string;
    portfolio_value: number;
}
