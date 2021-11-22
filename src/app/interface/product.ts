import { IResult } from '.';
export interface IProductData {
    product_id: string,
    name: string,
    sku: string,
    price: number,
    thumb1: string,
    thumb2: string,
    thumb3: string
    quantity: number,
    stock: number,
    state: string
}

export interface IProduct extends IResult {
    mw_code: string,
    name?: string,
    price?: string,
    stock?: string,
    stocktype_ea_or_bx?: string,
    total_results?: string,
    image?: string
}

export interface IUserProduct {
    product: string,
    email_address: string
}