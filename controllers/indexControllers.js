import { Apartment } from '../models/Apartment.model.js';
import { Reservation } from '../models/Reservation.model.js';
import { serviceIcons } from '../tools/serviceIcons.js';

export const getApartments = async (req, res) => {

    const allApartments = await Apartment.find();
    console.log("🚀 ~ app.get ~ allApartments:", allApartments)

    res.render('home.ejs', {
        allApartments, serviceIcons
    })
};

export const getApartmentById = async (req, res) => {
    const id = req.params.id;

    const apartment = await Apartment.findById(id);

    if (!apartment) {
        return res.status(404).send('¡Lo sentimos! No hemos podido encotrar el apartamento no solicitado');
    }

    console.log("ID:", id, "Apartment:", apartment);

    res.render('apartment-detail.ejs', { apartment, serviceIcons });
};

export const searchApartments = async (req, res) => {
    const { minPeople, maxPrice, city } = req.query;

    // Creem un objecte que filtra els paràmetres segons les condicions que establim
    const filter = {};

    // Creem les condicions de filtratge
    if (minPeople) filter.maxPeople = { $gte: Number(minPeople) };
    if (maxPrice) filter.price = { $lte: Number(maxPrice) };
    if (city) filter['location.city'] = { $regex: new RegExp(city, 'i') }

    /**To do: filtrar per dates. Per això haig de tenir els apartaments reservats, és a dir crear l'apartat de reserves
     * Crear vista filtered-apartments.ejs
     */

    // Creem l'objecte que contindrà els apartaments que compleixin les condicions de filter

    const filteredApartments = await Apartment.find(filter);

    res.render('filtered-apartments.ejs', { filteredApartments, serviceIcons });
}

export const bookApartment = async (req, res) => {
    try {
        // Recuperem les dades del formulari (falta l'username)
        // Recuperar id de l'apartament gràcies a l'input hidden del formulari d'apartment-detail.ejs

        const { apartment, checkIn, checkOut } = req.body;
        console.log('apartmentId recibido:', apartment);

        // Validació de dates
        if (new Date(checkOut) <= new Date(checkIn)) {
            return res.status(400).json({ error: 'La fecha de salida debe ser posterior a la fecha de entrada' });
        }
        // Validació que no se solapi amb una altra reserva

        const overlapping = await Reservation.findOne({
            apartment: apartment,
            $and: [
                { checkIn: { $lt: new Date(checkOut) } },
                { checkOut: { $gt: new Date(checkIn) } }
            ]
        });

        if (overlapping) {
            return res.status(409).json({ error: 'El apartamento ya está reservado en estas fechas' });
        }
        // També es podria calcular el nombre de nits i el preu total en funció del preu per nit

        // Creació de la reserva. 

        const newReservation = new Reservation({
            apartment: apartment,
            checkIn: checkIn,
            checkOut: checkOut
        });
        await newReservation.save();
        console.log(newReservation);
        res.status(201).json(newReservation);

        /**
         * To do:
         * 
         * - En comptes de mostrar els errors com a JSON, que es mostrin a la vista
         * 
         * - Falta recuperar l'username un cop haguem implementat el registre d'usuaris
         * 
            - També es podria recuperar el preu i calcular-ne el total, així com mostrar-lo a la vista també
         */
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error creando la reserva.' })
    }
}