import {StockCreationDTO} from "../models/interfaces";

export const isStockDataValid = (stock: any): stock is StockCreationDTO => {
    const stockObj = stock as any;
    console.log(stockObj)

    if (typeof stockObj !== 'object' || stockObj === null) return false;
    if (typeof stockObj.symbol !== 'string') return false;
    if (typeof stockObj.purchase_price !== 'number') return false;
    if (typeof stockObj.shares !== 'number') return false;

    if (stockObj.shares <= 0 || stockObj.purchase_price <= 0) return false;

    if (stockObj.name !== undefined && typeof stockObj.name !== 'string') return false;
    if (stockObj.purchase_date !== undefined) {
        if (typeof stockObj.purchase_date !== 'string') return false;
        if (stockObj.purchase_date !== 'NA' && !/^\d{2}-\d{2}-\d{4}$/.test(stockObj.purchase_date)) return false;
    }

    return true;
}

export const isStockHaveAllFields = (stock: StockCreationDTO): boolean => {
    return 'symbol' in stock && 'purchase_price' in stock && 'shares' in stock && 'name' in stock && 'purchase_date' in stock;
}
