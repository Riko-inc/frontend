

import {useStyles} from "./styles.ts"

function App() {

    const classes = useStyles()

    return (
        <>
            <div>Что</div>
            <button className={classes.redButton}>Кнопка</button>
        </>
    )
}

export default App
