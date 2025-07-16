import { Apartment } from '../models/Apartment.model.js';
import { Reservation } from '../models/Reservation.model.js';
import { serviceIcons } from '../tools/serviceIcons.js';

export const getApartments = async (req, res) => {

    const allApartments = await Apartment.find();

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
        const { apartment, checkIn, checkOut } = req.body;
        console.log('apartmentId recibido:', apartment);

        // Obtenim l'usuari autenticat
        if (!req.user) {
            return res.status(401).json({ error: 'Debes iniciar sesión para hacer la reserva' });
        }
        const userId = req.user._id; // referència a l’usuari
        const username = req.user.username; // 👈 aquí tens el nom d’usuari actual

        console.log('Usuari autenticat:', username);

        const now = new Date();
        if (new Date(checkIn) < now) {
              return res.status(400).json({ error: '¡Aún no se ha inventando la máquina del tiempo! La fecha de entrada debería ser anterior a hoy' });

        }
        // Validació de dates
        if (new Date(checkOut) <= new Date(checkIn)) {
            return res
                .status(400)
                .json({ error: 'La fecha de salida debe ser posterior a la fecha de entrada' });
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
            return res
                .status(409)
                .json({ error: 'El apartamento ya está reservado en estas fechas' });
        }

        // Creació de la reserva
        const newReservation = new Reservation({
            apartment: apartment,
            user: userId, // referència al camp 'user' del schema
            username: username,
            checkIn: checkIn,
            checkOut: checkOut
        });

        await newReservation.save();
        console.log('Reserva creada:', newReservation);

        res.status(201).json(newReservation);

        // TODO: mostrar errors a la vista EJS i no com JSON, calcular preu total, etc.
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error creant la reserva.' });
    }
};