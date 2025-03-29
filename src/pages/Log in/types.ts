export interface IUser {
    email: string;
    password: string;
}

export interface IJwtTokens {
    accessToken: string;
    refreshToken: string;
}