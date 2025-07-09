import { Apartment } from "../models/Apartment.model.js";
import { Reservation } from "../models/Reservation.model.js";

export const getNewApartment = (req, res) => {
    res.render("add-apartment.ejs", {
        apartment: {},
        editMode: false
    });
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

export const getEditApartment = async (req, res) => {
    // Recuperar doc per id
    const { id } = req.params;
    
    console.log(id)

    const apartment = await Apartment.findById(id);

    res.render('add-apartment.ejs', {
        apartment,
        editMode: true
    });
}

export const postEditApartment = async (req, res) => {
    const id = req.params.id.trim();

    console.log(id);

    const location = {
        province: req.body['location.province'],
        city: req.body['location.city'],
        coordinates: {
            lat: Number(req.body['location.coordinates.lat']),
            lng: Number(req.body['location.coordinates.lng'])
        }
    };

    await Apartment.findByIdAndUpdate(id, {
        title: req.body.title,
        description: req.body.description,
        rooms: req.body.rooms,
        beds: req.body.beds,
        bathrooms: req.body.bathrooms,
        maxPeople: req.body.maxPeople,
        photos: req.body.photos,
        mainPhoto: req.body.mainPhoto,
        price: req.body.price,
        squareMeters: req.body.size,
        services: req.body.services,
        location
        
    });

    res.redirect(`/apartment/${id}`)
}

export const deleteApartment = async (req, res) => {
    const id = req.params.id.trim();

    console.log(id);

    await Apartment.findByIdAndDelete(id);

    res.redirect('/');
};

export const showAllReservations = async (req, res) => {
    try {
        const reservations = Reservation.findById().populate('Apartment');
    } catch (error){
        res.status(500).send('Error al obtener las reservas');
    }
}