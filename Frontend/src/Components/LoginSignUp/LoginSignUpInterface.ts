export interface ILoginInterface {
    username: string,
    password: string
}

export interface ISignUpInterface {
    _id?: string,
    username: string,
    email: string,
    password: string,
    confirmPassword?: string,
}
