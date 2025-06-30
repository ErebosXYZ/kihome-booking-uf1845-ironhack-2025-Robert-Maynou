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

/**
 * 1. Capacidad del apartamento. Es decir, si somos 2 viajeros, mostrar los apartamentos que al menos tengan capacidad para 2 personas
2. Precio máximo por noche
3. Ciudad 
4. Fechas disponibles
 */