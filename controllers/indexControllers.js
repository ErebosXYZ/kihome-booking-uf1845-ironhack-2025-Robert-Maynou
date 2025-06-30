import { Apartment } from '../models/Apartment.model.js';
import { serviceIcons } from '../tools/serviceIcons.js';

export const getApartments = async (req, res)=> {
  
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

}

/**
 * 1. Capacidad del apartamento. Es decir, si somos 2 viajeros, mostrar los apartamentos que al menos tengan capacidad para 2 personas
2. Precio máximo por noche
3. Ciudad 
4. Fechas disponibles
 */