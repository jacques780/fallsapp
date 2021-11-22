import { IResult } from './result';
import { ESubmitResult } from '../enums';
export interface ISubmit extends IResult {
    submit_result: ESubmitResult
}