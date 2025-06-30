import { Apartment } from '../models/Apartment.model.js';
import { serviceIcons } from '../tools/serviceIcons.js';

export const getApartments = async (req, res)=> {
   // 1. Recuperar los datos del Modelo (Apartment)
    const allApartments = await Apartment.find();
    console.log("🚀 ~ app.get ~ allApartments:", allApartments)

   // 2. Este endpoint va a pasar los datos una vista
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