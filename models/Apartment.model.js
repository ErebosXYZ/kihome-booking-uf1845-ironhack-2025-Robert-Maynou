// Importació de mongoose (JS ES6, és com un require)

import mongoose from "mongoose";

// Desestrecturem mongoose per agafar només els objectes que necessitem
const { Schema, model } = mongoose;

const apartmentSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,

    },
    rooms: {
        type: Number,
        required: true
    },
    beds: {
        type: Number,
        required: true
    },
    bathrooms: {
        type: Number,
        required: true
    },
    photos: {
        type: [String], // Array d'URLs
        default: [],
        validate: {
            validator: function (v) {
                return v.length <= 4;
            }
        }
    },
    mainPhoto: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                // Comprovem que la URL estigui dins de photos
                return this.photos.includes(v);
            },
            message: props => `'${props.value}' no está dentro de la galería`
        }
    },

    price: {
        type: Number,
        required: true
    },
    squareMeters: {
        type: Number,
        required: true
    },
    // maxPeople: {
    //     type: Number,
    //     required: true
    // },
    services: {
        type: [String],
        enum: ['air-conditioning', 'heat', 'accessibility', 'kitchen', 'wi-fi'],
        default: []
    },
    location: {
        province: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        coordinates: {
            lat: {
                type: Number,
                required: true
            },
            lng: {
                type: Number,
                required: true
            }
        }
    }

});

/**-Qué servicios tiene
   -Aire acondicionado
   -Calefacción
   -Si el edificio está adaptado para personas con movilidad reducida
   -Televisión
   -Cocina
   -Conexión a Internet
-Ubicación del apartamento
   -Provincia
   -Ciudad 
   -Coordenadas GPS */

// Afegir les validacions corresponents quan haguem pogut inserir apartaments a la base de dades amb el formulari connectat a mongodb!!!


// Creació del model i exportació (export substitueix a module exports)

export const Apartment = model('Apartment', apartmentSchema);