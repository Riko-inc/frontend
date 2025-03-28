import AuthProvider from "./provider/AuthProvider.tsx";

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

import Routes from "./routes/Routes.tsx"



const queryClient = new QueryClient()

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
