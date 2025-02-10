import mongoose, { Schema, Document } from 'mongoose';
// Interface TypeScript pour le document utilisateur

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    stock: number;
    addedAt: Date;
}

// Définir le schéma Mongoose
const ProductSchema: Schema = new Schema({
    name: { type: String, required: true, unique:true },
    description: { type: String, required: true},
    price: { type: Number, required: true },
    stock: { type: Number, required:true}, // Date d'ajout par défaut à l'instant présent
    addedAt: { type: Date, default: Date.now } // Date d'ajout par défaut à l'instant présent
});

// Exporter le modèle
export default mongoose.model<IProduct>('Product', ProductSchema);