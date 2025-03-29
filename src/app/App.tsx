
import AuthProvider from "./provider/AuthProvider.tsx";

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

import Routes from "./routes/Routes.tsx"



const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: (failureCount, error: any) => {
                if (error?.response?.status === 403) return false;
                return failureCount < 3;
            }
        }
    }
});

function App() {

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Routes />
            </AuthProvider>
        </QueryClientProvider>
    )
}

export default App
