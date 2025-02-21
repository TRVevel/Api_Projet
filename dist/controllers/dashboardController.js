"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stockByProduct = stockByProduct;
exports.monthlyRevenue = monthlyRevenue;
const ProductSchema_1 = __importDefault(require("../DBSchemas/ProductSchema"));
const OrderSchema_1 = __importDefault(require("../DBSchemas/OrderSchema"));
// Affichage du stock par produit
function stockByProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Récupérer tous les produits avec leur nom, description et stock
            const products = yield ProductSchema_1.default.find().select("name description stock ");
            // Vérifier qu'il y a bien au moins un produit
            if (products.length === 0) {
                res.status(404).json({ message: "Aucun produit trouvé !" });
                return;
            }
            res.status(200).json({ message: "Les stock des produit est en couleur rouge ", data: products });
        }
        catch (err) {
            res.status(500).json({ message: "Erreur interne", error: err.message });
            return;
        }
    });
}
// Affichage du chiffre d'affaires du mois (commandes créées le mois courant et pas annulées)
function monthlyRevenue(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // stocker la date du jour dans "now"
            const now = new Date();
            // Initialisation du premier et du dernier jour du mois :
            //    dans "firstDayOfMonth" on initialise le premier jour du mois à partir de "now"
            //    on récupère le mois par getMonth() et le "1" passé en argument représente le premier jour
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            //    dans "lastDayOfMonth" on initialise le dernier jour du mois à partir de "now"
            //    ici avec "+ 1", on passe au mois suivant. L'argument "0" représente le dernier jour du M-1
            const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            const month = new Date().toLocaleString("fr-FR", { month: "long" });
            // Récupérer les commandes du mois qui ne sont pas annulées
            const orders = yield OrderSchema_1.default.find({
                //createdAt est une constante qui borne le mois (premier et dernier jour)
                createdAt: { $gte: new Date(firstDayOfMonth.toISOString()), $lte: new Date(lastDayOfMonth.toISOString()) },
                //$gte, $lte sont des commandes MongoDB
                //"$gte" : greater than or equals, "$lte" : less than or equals) et "$ne" : not equal to
                status: { $ne: "annulée" }
                //$ne commande MongoDB (not equal to)
            });
            //Initialisation du C.A.
            let totalRevenue = 0;
            // Parcourir les commandes pour calculer le chiffre d'affaires
            for (const order of orders) {
                if (!order) {
                    console.warn(`Pas de commande trouvée pour le mois de ${month}`);
                    continue;
                }
                totalRevenue += order.ttPrice;
            }
            res.status(200).json({
                message: "Le chiffre d'affaires H.T. du mois de " + month + " est de : "
                    + parseFloat(totalRevenue.toFixed(2)).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €"
            });
        }
        catch (err) {
            res.status(500).json({ message: "Erreur interne", error: err.message });
            return;
        }
    });
}
