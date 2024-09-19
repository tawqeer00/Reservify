const mongoose = require("mongoose");

const venueSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        address: { type: String, required: true },
        capacity: { type: Number },
        type: { type: String, enum: ["IT", "LAW", "MATHS", "PHYSICS", "CHEM"], required: true } // added type field with enum
    },

    {
        timestamps: true,
    }
    
);

module.exports = mongoose.model("Venue", venueSchema);
