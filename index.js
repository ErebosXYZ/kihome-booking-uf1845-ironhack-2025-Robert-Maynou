import 'dotenv/config';
import express from 'express';
import { connectDB } from './tools/db.js';
import { Apartment } from './models/Apartment.model.js';
// Importem totes les rutes que tenen a veure amb els usuaris generals des del fitxer corresponent
import indexRoutes  from './routes/indexRoutes.js'; 
import adminRoutes from './routes/adminRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(indexRoutes);
app.use('/admin', adminRoutes);


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log('Escuchando peticiones en el puerto http://localhost:3000')
    });
});
