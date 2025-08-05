import {useMutation} from "@tanstack/react-query";
import {IUser} from "../pages/Login/types.ts";
import {api} from "../app";
import {API_ENDPOINTS} from "../shared/endpoints.ts";




export const authApi = {
    loginUser: (newUser: IUser) => api.post(API_ENDPOINTS.LOGIN, newUser),
    signupUser: (newUser: IUser) => api.post(API_ENDPOINTS.SIGNUP, newUser),
    refreshTokens: () => {},
}

export const useLoginUser =
    () => useMutation({mutationFn: authApi.loginUser})
export const useSignUpUser =
    () => useMutation(
        {mutationFn: (newUser: IUser) => api.post(API_ENDPOINTS.SIGNUP, newUser)})