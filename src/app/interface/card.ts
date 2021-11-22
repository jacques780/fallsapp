import { IResult, IProduct } from '.';
export interface IOrderCard {
    email_address?: string,
    mw_code: string,
    name?: string,
    qty: number
}

export interface IGetCardResult extends IResult {
    total_cart_items: number,
    cart: string,
}

export interface IOrderCardFull extends IOrderCard, IProduct {
    state?: string;
    old_state?: string;
}
export interface IOrderHistory {
    order_id_real: string,
    order_date: string,
    total_items: string
}
export interface IGetOrderHistoryResult extends IResult {
    total_orders: number,
    order_history: string,
}