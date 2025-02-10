import mongoose, { Schema, Document } from 'mongoose';
// Interface TypeScript pour le document utilisateur

export interface IUser extends Document {
    name: string;
    hashedPassword: string;
    role: string;
    addedAt: Date;
}

// Définir le schéma Mongoose
const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    hashedPassword: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], required: true, default: 'user' }, // rôle par défaut: utilisateur
    addedAt: { type: Date, default: Date.now } // Date d'ajout par défaut à l'instant présent
});

// Exporter le modèle
export default mongoose.model<IUser>('User', UserSchema);