const {Schema, model }= require("mongoose")


const logsSchema = new Schema({
    ip: String,
    method: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    latitude: Number,
    longitude: Number,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Logs = model("Logs", logsSchema);

