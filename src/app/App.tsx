
import AuthProvider from "./contexts/AuthContext.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import Routes from "./routes/Routes.tsx"
import {ThemeProvider} from "react-jss";
import {lightTheme} from "../shared/styles/themes.ts";
import {useGlobalStyles} from "../shared/styles/globalStyles.ts";
import {Provider} from "react-redux";
import {setupStore} from "../shared/store/store.ts";
import {DndContext, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";




const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // keepPreviousData: true,
            //placeholderData: (prev) => prev,
            refetchOnWindowFocus: false,
            retry: (failureCount, error: any) => {
                if (error?.response?.status === 403) return failureCount < 1;
                return failureCount < 3;
            }
        }
    }
});




function App() {

    // const [currentTheme, setCurrentTheme] = useState<ITheme>(lightTheme);
    useGlobalStyles({ theme: lightTheme });

    const store = setupStore()

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                delay: 300, // Задержка в миллисекундах (1 секунда)
                tolerance: 15, // Допустимое смещение курсора во время задержки
            },
        })
    );


    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <DndContext sensors={sensors}>
                    <ThemeProvider theme={lightTheme}>
                        <AuthProvider>
                            <Theme>
                                <Routes/>
                            </Theme>
                        </AuthProvider>
                    </ThemeProvider>
                </DndContext>
            </Provider>
            {/*<ReactQueryDevtools initialIsOpen={false} />*/}
        </QueryClientProvider>
    )
}


export default App
