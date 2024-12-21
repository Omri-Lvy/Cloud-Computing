import axios from "axios";
import {PortfolioValue, Stock, StockValue} from "../models/interfaces";

const API_KEY = process.env.NINJA_API_KEY;
const API_URL = `${process.env.NINJA_API_URL}/stockprice`;

if (!API_KEY) {
    throw new Error('NINJA_API_KEY environment variable is not set');
}

export const getStockPrice = async (symbol: string): Promise<number> => {
    try {
        const response = await axios.get(`${API_URL}?ticker=${symbol}`, {
            headers: {
                'X-Api-Key': API_KEY,
            },
        });

        if (!response.data || response.data.length === 0) {
            new Error(`No data found for symbol: ${symbol}`);
        }

        return Number(response.data.price.toFixed(2));
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(`API response code ${error.response?.status}`);
        }
        throw error;
    }
};

export const calculateStockValue = async (stock: Stock): Promise<StockValue> => {
    const currentPrice = await getStockPrice(stock.symbol);
    return {
        symbol: stock.symbol,
        ticker: stock.shares,
        stock_value: Number((currentPrice * stock.shares).toFixed(2)),
    };
};

export const calculatePortfolioValue = async (stocks: Stock[]): Promise<PortfolioValue> => {
    const stockValues = await Promise.all(stocks.map(calculateStockValue));
    const totalValue = stockValues.reduce((acc, stockValue) => acc + stockValue.stock_value, 0);
    return {
        date: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
        portfolio_value: Number(totalValue.toFixed(2))
    };
};
