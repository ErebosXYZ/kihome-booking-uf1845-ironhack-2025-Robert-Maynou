import 'dotenv/config';
import express from 'express';
import { connectDB } from './tools/db.js';
import { Apartment } from './models/Apartment.model.js';

const app = express();
const PORT = process.env.PORT || 3000;
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }))
app.use(express.json());

 const serviceIcons = {
        'air-conditioning': '❄️',
        'heat': '🔥',
        'accessibility': '♿',
        'kitchen': '🍽️',
        'wi-fi': '📶'
    };


app.get('/', async (req, res) => {
    const allApartments = await Apartment.find();

   

    res.render('home.ejs', {
        allApartments,
        serviceIcons
    });

});


app.get('/admin/apartment/new', (req, res) => {
    res.render("add-apartment.ejs");
});


/** To do:
 * Enllaçar al detall de l'apartament per ID. Recuperar les dades de l'apartament que té la ID al backend. El frontend ja està preparat de la homepage està preparat.
 * Simplement crear el .get per ID i fer que renderitzi una vista amb totes les dades de l'apartament
 * 
 * 
 */

app.get('/apartment/:idApartment', async (req, res) => {
    const id = req.params.idApartment;

    const apartment = await Apartment.findById(id);

    if (!apartment) {
        return res.status(404).send('¡Lo sentimos! No hemos podido encotrar el apartamento no solicitado');
    }

    res.render('apartment-detail.ejs', { apartment, serviceIcons });
})


app.post('/admin/apartment', async (req, res) => {
    console.log(req.body);

    let { title, description, rooms, beds, bathrooms, photos, mainPhoto, price, size, services } = req.body;

    // Normalitza arrays
    if (!Array.isArray(photos)) photos = [photos];
    if (services && !Array.isArray(services)) services = [services];

    // Construeix location manualment
    const location = {
        province: req.body['location.province'],
        city: req.body['location.city'],
        coordinates: {
            lat: Number(req.body['location.coordinates.lat']),
            lng: Number(req.body['location.coordinates.lng'])
        }
    };
    

    // Converteix a número
    rooms = Number(rooms);
    beds = Number(beds);
    bathrooms = Number(bathrooms);
    price = Number(price);
    size = Number(size);

    if (photos.length < 4) {
        return res.status(400).send('Com a mínim calen 4 fotos.');
    }

    const mainIndex = parseInt(mainPhoto, 10);
    if (isNaN(mainIndex) || mainIndex < 0 || mainIndex >= photos.length) {
        return res.status(400).send('Foto principal invàlida.');
    }

    try {
        await Apartment.create({
            title,
            description,
            rooms,
            beds,
            bathrooms,
            photos,
            mainPhoto: photos[mainIndex],
            price,
            squareMeters: size,
            services,
            location
        });

        res.send('Apartamento insertado correctamente! Puedes volver a la página principal haciendo click <a href="/"> aquí </a>.');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Ups! Algo ha ido mal. Hemos informado a los desarrolladores. Puedes volver a la página principal haciendo click <a href="/"> aquí </a>');
    }
});


connectDB().then(() => { app.listen(PORT, () => {
    console.log('Escuchando peticiones en el puerto http://localhost:3000')
});
});
