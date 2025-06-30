import { Apartment } from "../models/Apartment.model.js";

export const getNewApartment = (req, res)=> {
    res.render("add-apartment.ejs");
};

export const postNewApartment = async (req, res)=> {
   console.log(req.body);

    let { title, description, rooms, beds, bathrooms, photos, mainPhoto, price, size, services, maxPeople } = req.body;

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
    maxPeople = Number(maxPeople);

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
            maxPeople,
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
}