export interface IButtonType {
    text: string,
    role: string
}
export interface IPresentAlert {
    header: string,
    message: string
    buttons: IButtonType[]
}