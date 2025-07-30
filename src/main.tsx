import { createRoot } from 'react-dom/client'
import App from './app/App.tsx'
import {StrictMode} from "react";
import { create } from 'jss'
import preset from 'jss-preset-default'
import { JssProvider } from 'react-jss'


const jss = create({
    ...preset(),
    insertionPoint: document.getElementById('jss-insertion-point')!,
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <JssProvider jss={jss}>
            <App />
        </JssProvider>
    </StrictMode>
)
