import mongoose, { Schema, Document } from 'mongoose';
// Interface TypeScript pour le document utilisateur

export interface UserI extends Document {
    name: string;
    hashedPassword: string;
    role: string;
}

// Définir le schéma Mongoose
const UserSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    role: { type: String, required: true, default: 'user' } 
});

// Exporter le modèle
export default mongoose.model<UserI>('User', UserSchema);