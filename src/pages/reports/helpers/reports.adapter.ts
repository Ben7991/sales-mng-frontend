import { MoneyShareData, MoneyShareResponse } from '../models/interface';

/**
 * Transforms money share data by formatting the amount field to 2 decimal places
 */
export function transformMoneyShareData(data: MoneyShareData[]): MoneyShareData[] {
  return data.map(record => ({
    ...record,
    amount: Number(record.amount.toFixed(2))
  }));
}

/**
 * Transforms the entire money share response
 */
export function transformMoneyShareResponse(response: MoneyShareResponse): MoneyShareResponse {
  return {
    ...response,
    data: transformMoneyShareData(response.data),
    bonus: Number(response.bonus.toFixed(2))
  };
}
