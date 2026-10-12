const mongoose = require("mongoose");

const compositionItemSchema = new mongoose.Schema(
    {
        material: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RawMaterial",
            required: true
        },

        quantityPerUnit: {
            type: Number,
            required: true,
            validate: {
                validator: value => value > 0,
                message: "La quantité doit être strictement positive."
            }
        }
    },
    {
        _id: false
    }
);

const productSchema = new mongoose.Schema(
    {
        reference: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            trim: true,
            default: ""
        },

        composition: {
            type: [compositionItemSchema],
            required: true,
            validate: [
                {
                    validator: items => items.length > 0,
                    message: "Un produit doit contenir au moins une matière."
                },
                {
                    validator: items => {
                        const ids = items.map(item =>
                            String(item.material)
                        );

                        return new Set(ids).size === ids.length;
                    },
                    message: "Une matière ne peut apparaître qu'une seule fois."
                }
            ]
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Product", productSchema);