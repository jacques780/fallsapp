import { IResult } from '.';
export interface IAutoCompleteSearch extends IResult {
    results: string;
    total_results: number;
}

export interface IProductResult {
    mw_code: string,
    mw_stockonhand: string,
    name: string,
}