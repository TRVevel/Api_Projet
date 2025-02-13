import mongoose, { Schema, Document } from 'mongoose';


export interface CustomerI extends Document {
    email: string;
    name: string;
    address: string;
    phone: string;
    active: boolean;
}
// Définition du schéma Mongoose
const CustomerSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: {type: String, required: true},
    active: { type: Boolean, required: true, default: true }
});

// Exporter le modèle
export default mongoose.model<CustomerI>('Customer', CustomerSchema);