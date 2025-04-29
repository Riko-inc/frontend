import {useQuery} from "@tanstack/react-query";
import {api} from "../../app";
import {API_ENDPOINTS} from "../../shared/config.ts";

interface IUserServerData {
    email: string,
    id: number,
    role: string,
    registrationDateTime: string,
}

export const useUsers = () => {
    return useQuery<IUserServerData[]>({
        queryKey: ['users'],
        queryFn: getUsers
    })
}

const getUsers = async () => {
    const response = await api.get<IUserServerData[]>(API_ENDPOINTS.USERS)
    return response.data;
}

