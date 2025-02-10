import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import customerRoutes from './routes/customerRoutes';
import orderRoutes from './routes/orderRoutes';
import dashboardRoutes from './routes/dashboardRoutes';


//Création d'un serveur Express
const app = express();

//Chargement des variables d'environnement
dotenv.config();

//Définition du port du serveur
const PORT = process.env.PORT;
console.log("lancement du serveur")

//Config du serveur par défaut
app.use(express.json());

//TODO ajouter ici connection à la BDD
const connectDB = async () => {
    try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('MongoDB connecté avec succès');
    } catch (err) {
    console.error('Erreur lors de la connexion à MongoDB:', err);
    process.exit(1);
    }
   };
   connectDB();

//TODO ajouter ici les routes
app.use('/a', authRoutes);
app.use('/p', productRoutes); 
app.use('/c', customerRoutes);
app.use('/o', orderRoutes);
app.use('/d', dashboardRoutes);


//app.listen indique au serveur d'écouter les requêtes HTTP arrivant sur le port indiqué
app.listen(PORT, () => {
 console.log(`Server is running on http://localhost:${PORT}`);
});
