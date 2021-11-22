import { ELoginResult } from '../enums';
import { IResult } from '.';
export interface IAuthen extends IResult {
    user_group_val: string,
    login_result: ELoginResult
}