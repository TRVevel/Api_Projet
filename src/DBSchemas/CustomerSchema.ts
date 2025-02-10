import mongoose, { Schema, Document } from 'mongoose';
// Interface TypeScript pour le document utilisateur

export interface ICustomer extends Document {
    name: string;
    adress: string;
    email: string;
    phone: string;
    orderHistory:string[];
    isActive:boolean;
    addedAt: Date;
}

// Définir le schéma Mongoose
const CustomerSchema: Schema = new Schema({
    name: { type: String, required: true, unique:true },
    adress: { type: String, required: true},
    email: { type: String, required: true },
    phone: { type: String, required:true}, 
    orderHistory: { type: [String], required:true, default: []},
    isActive: { type: Boolean, required:true, default: true},
    addedAt: { type: Date, default: Date.now } // Date d'ajout par défaut à l'instant présent
});

// Exporter le modèle
export default mongoose.model<ICustomer>('Customer', CustomerSchema);