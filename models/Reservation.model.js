// Importació de mongoose (JS ES6, és com un require)

import mongoose from "mongoose";

// Desestrecturem mongoose per agafar només els objectes que necessitem
const { Schema, model } = mongoose;


// To-do: falta implementar registre d'usuari, un cop fet posar el camp username: 'string'

const reservationSchema = new Schema({
    apartment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Apartment',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: {
        type: String,
        required: true
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value > this.checkIn
            },
            message: 'La fecha de salida debe ser posterior a la de entrada.'
        }
    }
})


export const Reservation = model('Reservation', reservationSchema);