const mongoose = require("mongoose");

const compositionSnapshotSchema = new mongoose.Schema(
    {
        material: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RawMaterial",
            required: true
        },

        reference: {
            type: String,
            required: true
        },

        name: {
            type: String,
            required: true
        },

        unit: {
            type: String,
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

const productSnapshotSchema = new mongoose.Schema(
    {
        reference: {
            type: String,
            required: true
        },

        name: {
            type: String,
            required: true
        },

        composition: {
            type: [compositionSnapshotSchema],
            required: true
        }
    },
    {
        _id: false
    }
);

const manufacturingOrderSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        productSnapshot: {
            type: productSnapshotSchema,
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            validate: {
                validator: value => value > 0,
                message: "La quantité à fabriquer doit être positive."
            }
        },

        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        startedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        completedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        cancelledBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        status: {
            type: String,
            enum: [
                "planned",
                "in_progress",
                "completed",
                "cancelled"
            ],
            default: "planned",
            required: true
        },

        startedAt: {
            type: Date,
            default: null
        },

        completedAt: {
            type: Date,
            default: null
        },

        cancelledAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "ManufacturingOrder",
    manufacturingOrderSchema
);