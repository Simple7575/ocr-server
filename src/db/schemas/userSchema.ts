import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        id: { type: Number, required: true },
        first_name: { type: String, required: true },
        last_name: String,
        username: String,
        usedQuantity: { type: Number, default: 0 },
        createdAt: { type: Date, default: new Date() },
        lastUse: { type: Date, default: new Date() },
    },
    {
        bufferCommands: false,
        autoCreate: false, // disable `autoCreate` since `bufferCommands` is false
    }
);

const User = mongoose.model("User", userSchema);

export default User;
