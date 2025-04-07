import {useQuery} from "@tanstack/react-query";
import {api} from "../../app/provider/AuthProvider.tsx";
import {API_ENDPOINTS} from "../../shared/config.ts";

interface IUser {
    email: string,
    id: number,
    role: string,
    registrationDateTime: string,
}

export const useUsers = () => {
    return useQuery<IUser[]>({
        queryKey: ['users'],
        queryFn: getUsers
    })
}

const getUsers = async () => {
    const response = await api.get<IUser[]>(API_ENDPOINTS.USERS)
    return response.data;
}