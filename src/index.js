import express from "express"
import cors from "cors"
import morgan from "morgan"
import {connectDb} from "./db.js"

const app = express();

app.use(express.json());
app.use(cors())
app.use(morgan('dev'))

const PORT = process.env.PORT || 3000

try {
    await connectDb.query('select 1');
    console.log('Conexion con la base de datos exitosa')
} catch (err) {
    console.error('Error al conectar la base de datos', err.message);
    throw err;
} 

app.get('/api', (req, res) => {
    res.send('la api funca')
})

app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`)
})