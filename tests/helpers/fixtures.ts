import { RawDataRow } from '../../src/domain/entities/Chart';

export function createRawDataRows(): RawDataRow[] {
  return [
    { category: 'Electronics', date: '2025-01-01', totalAmount: 1500.0, totalQuantity: 5 },
    { category: 'Electronics', date: '2025-01-02', totalAmount: 2000.0, totalQuantity: 3 },
    { category: 'Clothing', date: '2025-01-01', totalAmount: 300.0, totalQuantity: 10 },
    { category: 'Clothing', date: '2025-01-02', totalAmount: 450.0, totalQuantity: 8 },
    { category: 'Food & Beverages', date: '2025-01-01', totalAmount: 120.0, totalQuantity: 20 },
  ];
}

export function createEmptyRawData(): RawDataRow[] {
  return [];
}

export function createSingleCategoryData(): RawDataRow[] {
  return [
    { category: 'Electronics', date: '2025-03-01', totalAmount: 500.0, totalQuantity: 2 },
    { category: 'Electronics', date: '2025-03-02', totalAmount: 750.0, totalQuantity: 3 },
  ];
}
