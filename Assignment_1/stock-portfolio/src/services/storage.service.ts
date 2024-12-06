import {Stock, StockCreationDTO} from "../models/interfaces";
import {generateId} from "../utils/id.utils";

const stocksData = new Map<string, Stock>();
const usedIds = new Set<string>();


const formatStock = (stock: Stock): Stock => ({
    ...stock,
    purchase_price: Number(stock.purchase_price.toFixed(2)),
    symbol: stock.symbol.toUpperCase(),
});

export const createStock = async (stockData: StockCreationDTO): Promise<Stock> => {
    const id = generateId();
    const stock: Stock = formatStock({
        id,
        name: stockData.name || 'NA',
        symbol: stockData.symbol,
        purchase_price: stockData.purchase_price,
        purchase_date: stockData.purchase_date || 'NA',
        shares: stockData.shares,
    });

    stocksData.set(id, stock);
    return stock;
}

export const getStock = async (id: string): Promise<Stock | null> => {
    const stock = stocksData.get(id);
    return stock ? formatStock(stock) : null;
}

export const getStocks = async (): Promise<Stock[]> => {
    return Array.from(stocksData.values());
}

export const updateStock = async (id: string, stockData: StockCreationDTO): Promise<Stock | null> => {
    const stock = stocksData.get(id);
    if (!stock) {
        return null;
    }
    const updatedStock: Stock = formatStock({
        ...stock,
        name: stockData.name || stock.name,
        purchase_price: stockData.purchase_price || stock.purchase_price,
        purchase_date: stockData.purchase_date || stock.purchase_date,
        shares: stockData.shares || stock.shares,
    });
    stocksData.set(id, updatedStock);
    return updatedStock;
}

export const deleteStock = async (id: string): Promise<boolean> => {
    return stocksData.delete(id);
}

export const findStockByQuery = async (query: Record<string, string>): Promise<Stock[]> => {
    return Array.from(stocksData.values()).filter(stock => (
        Object.entries(query).every(([key, value]) => (
            stock[key as keyof Stock] === value
        ))
    ));
}

export const isUsedId = (id: string): boolean => usedIds.has(id);

export const addIdToUsedIdsList = (id: string): Set<string> => usedIds.add(id);
