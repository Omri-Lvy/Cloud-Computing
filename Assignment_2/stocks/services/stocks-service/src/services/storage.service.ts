import { Stock, StockCreationDTO } from "../models/interfaces";
import { generateId } from "../utils/id.utils";
import { getStocksCollection } from "../config/database";

const formatStock = (stock: Stock): Stock => ({
    ...stock,
    purchase_price: Number(stock.purchase_price.toFixed(2)),
    symbol: stock.symbol.toUpperCase(),
});

export const createStock = async (stockData: StockCreationDTO): Promise<Stock> => {
    const collection = getStocksCollection();
    const id = generateId();

    const stock: Stock = formatStock({
        id,
        name: stockData.name || 'NA',
        symbol: stockData.symbol,
        purchase_price: stockData.purchase_price,
        purchase_date: stockData.purchase_date || 'NA',
        shares: stockData.shares,
    });

    const existingStock = await collection.findOne({ symbol: stock.symbol });
    if (existingStock) {
        throw new Error('Stock with this symbol already exists');
    }

    await collection.insertOne(stock);
    return stock;
};

export const getStock = async (id: string): Promise<Stock | null> => {
    const collection = getStocksCollection();
    const stock = await collection.findOne({ id });
    return stock ? formatStock(stock) : null;
};

export const getStocks = async (): Promise<Stock[]> => {
    const collection = getStocksCollection();
    const stocks = await collection.find({}).toArray();
    return stocks.map(formatStock);
};

export const updateStock = async (id: string, stockData: StockCreationDTO): Promise<Stock | null> => {
    const collection = getStocksCollection();
    const existingStock = await collection.findOne({ id });

    if (!existingStock) {
        return null;
    }

    const updatedStock: Stock = formatStock({
        ...existingStock,
        name: stockData.name || existingStock.name,
        purchase_price: stockData.purchase_price || existingStock.purchase_price,
        purchase_date: stockData.purchase_date || existingStock.purchase_date,
        shares: stockData.shares || existingStock.shares,
    });

    await collection.updateOne({ id }, { $set: updatedStock });
    return updatedStock;
};

export const deleteStock = async (id: string): Promise<boolean> => {
    const collection = getStocksCollection();
    const result = await collection.deleteOne({ id });
    return result.deletedCount > 0;
};

export const findStockByQuery = async (query: Record<string, string>): Promise<Stock[]> => {
    const collection = getStocksCollection();
    const stocks = await collection.find(query).toArray();
    return stocks.map(formatStock);
};
