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
    return res.status(404).render("404.ejs", {
      message: "¡Lo sentimos! No hemos podido encontrar el apartamento solicitado.",
    });
  }

  console.log(`ID: ${id}, apartment: ${apartment}`)

  res.render("apartment-detail.ejs", { apartment, serviceIcons });
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
            req.flash('error', 'Debes iniciar la sesión para hacer la reserva') 
            return res.redirect('/login')
        }
        const userId = req.user._id;
        const username = req.user.username;

        console.log(`Username: ${username}, id: ${userId}`);

        const now = new Date();
        if (new Date(checkIn) < now) {
            req.flash('error', 'Para poder procesar correctamente la reserva la fecha de entrada debe ser posterior a hoy' )
            return res.redirect('/');

        }
        // Validació de dates
        if (new Date(checkOut) <= new Date(checkIn)) {
            req.flash('error', 'La fecha de salida debe ser posterior a la fecha de entrada' )
            return res.redirect('/')
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
            req.flash('error', 'El apartamento ya está reservado en estas fechas');
            return res.redirect('/');
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

        req.flash('success', 'Reserva completada con éxito');
        res.redirect('/');

    } catch (err) {
        console.error(err);
        req.flash('error', 'Error creando la reserva.');
        res.redirect('/');
    }
};