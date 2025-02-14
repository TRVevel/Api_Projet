import mongoose, { Schema, Document } from 'mongoose';
// Interface TypeScript pour le document utilisateur
export enum Status{
    pending='pending',
    shipped='shipped',
    delivered='delivered',
    cancelled='cancelled'
}
export interface IOrder extends Document {
    customer: string;
    productList: string[];
    unitPriceList: number[];
    ttPrice: number;
    quantityList: number[];
    status: Status;
    modifiedAt: Date;
    createdAt: Date;
}

// Définir le schéma Mongoose
const OrderSchema: Schema = new Schema({
    customer: { type: String, required: true },
    productList: { type: [String], required: true, default: [] },
    unitPriceList: { type: [Number], required: true, default: [] },
    ttPrice: { type: Number, required: true },
    quantityList: { type: [Number], required:true}, // Date d'ajout par défaut à l'instant présent
    status: { type: String, enum:  Object.values(Status), required: true, default: Status.pending }, // en attente, expédiée, livrée, annulée(en attente par défaut)
    modifiedAt: { type: Date, default: Date.now }, // Date de modification par défaut à l'instant présent
    createdAt: { type: Date, default: Date.now } // Date d'ajout par défaut à l'instant présent
});

// Exporter le modèle
export default mongoose.model<IOrder>('Order', OrderSchema);