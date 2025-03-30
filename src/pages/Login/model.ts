

// const { setAccessToken, setRefreshToken } = useAuth();
// const navigate = useNavigate();
//
// interface MutationProps {
//     newUser: IUser;
//     url: string;
// }
//
// export const sendUser = useMutation({
//     mutationFn: ({newUser, url}: MutationProps): Promise<IJwtTokens> =>
//         apiAxios.post(`/auth/${url}`, {
//             email: newUser.email,
//             password: newUser.password,
//         }),
//     onSuccess: (data) => {
//         setAccessToken(data.accessToken)
//         setRefreshToken(data.refreshToken)
//         navigate("/main")
//     },
//     onError: (error) => {
//         console.error(error);
//     }
// });