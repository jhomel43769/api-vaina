import express from "express"
import cors from "cors"
import morgan from "morgan"
import { sequelize } from "./db.js";
import { router } from "./routes/auth.routes.js";
import './models/indexModel.js'; 

const app = express();

app.use(express.json());
app.use(cors())
app.use(morgan('dev'))

const PORT = process.env.PORT || 3000


try {
    await sequelize.query('select 1');
    console.log('Conexion con la base de datos existosa')
} catch (err) {
    console.error('Error al conectase con la base de datos', err.message)
    throw err;
}

app.use('/api', router)


app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`)
})