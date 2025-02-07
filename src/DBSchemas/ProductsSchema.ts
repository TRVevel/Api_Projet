import mongoose, { Schema, Document } from 'mongoose';
// Interface TypeScript pour le document utilisateur

export interface ProductI extends Document {
    name: string;
    description: string;
    prixUnitaire: number;
    stock: number;
}

// Définir le schéma Mongoose
const ProductSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String},
    prixUnitaire: { type: Number, required: true }, 
    stock: { type: Number, required: true }
});

// Exporter le modèle
export default mongoose.model<ProductI>('product', ProductSchema);