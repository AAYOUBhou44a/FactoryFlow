const mongoose = require("mongoose");

const installationSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            default: "factoryflow",
            unique: true,
            immutable: true
        },

        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        installedAt: {
            type: Date,
            default: Date.now,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Installation", installationSchema);