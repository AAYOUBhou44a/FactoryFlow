const mongoose = require("mongoose");

const stockMovementSchema = new mongoose.Schema(
    {
        rawMaterial: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RawMaterial",
            required: true
        },

        type: {
            type: String,
            enum: ["ENTRY", "EXIT"],
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            validate: {
                validator: value => value > 0,
                message: "La quantité du mouvement doit être positive."
            }
        },

        stockBefore: {
            type: Number,
            required: true,
            min: 0
        },

        stockAfter: {
            type: Number,
            required: true,
            min: 0
        },

        manufacturingOrder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ManufacturingOrder",
            default: null
        },

        performedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("StockMovement", stockMovementSchema);