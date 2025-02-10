import mongoose, { Schema, Document } from 'mongoose';

// Interface TypeScript pour le document utilisateur

export interface OrderI extends Document {
    numOrder:Number,
    customerId: string,
    createDate: Date,    
    dateModifyStatus: Date,
    products: Array<{ productId: string, quantity: number, discount: number }>,
    status: string,
}

// Définir le schéma Mongoose
const OrdersSchema: Schema = new Schema({
    numOrder: {type:Number, required:true, unique:true},
    customerId: { type: String, required: true },
    createDate: { type: Date, default: Date.now },
    dateModifyStatus: { type: Date, default: Date.now },
    products: [
        {
            productId: { type: String, required: true },
            quantity: { type: Number, required: true },
            discount: { type: Number, default: 0 }
        }
    ],
    status: { type: String, default: "en attente" },
});

// Exporter le modèle
export default mongoose.model<OrderI>('order', OrdersSchema);