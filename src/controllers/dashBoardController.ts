import { Request, Response } from "express";
import ProductsSchema from "../DBSchemas/ProductsSchema";
import OrdersSchema from "../DBSchemas/OrdersSchema";

// Affichage du stock par produit
export async function stockByProduct(req: Request, res: Response) {
    try {
        // Récupérer tous les produits avec leur nom, description et stock
        const products = await ProductsSchema.find().select("name description stock ");

        // Vérifier qu'il y a bien au moins un produit
        if (products.length===0) {
            res.status(404).json({ message: "Aucun produit trouvé !" });
            return;
        }

        res.status(200).json({ message: "Stocks des produits récupérés avec succès", data: products });
    } catch (err: any) {
        res.status(500).json({ message: "Erreur interne", error: err.message });
    }
}

//Affichage du chiffre d'affaires du mois (commandes créées le mois courant et pas annulées)
export async function monthlyRevenue(req: Request, res: Response) {
    try {
        
        // stocker la date du jour dans "now"
        const now = new Date();

        // Initialisation du premier et du dernier jour du mois :
        //    dans "firstDayOfMonth" on initialise le premier jour du mois à partir de "now"
        //    on récupère le mois par getMonth() et le "1" passé en argument représente le premier jour
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        //    dans "lastDayOfMonth" on itiialise le dernier jour du mois à partir de "now"
        //    ici avec "+ 1", on passe au mois suivant. L'argument "0" représente le dernier jour du M-1
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // Récupérer les commandes du mois qui ne sont pas annulées
        const orders = await OrdersSchema.find({

            //createDate est une constante qui borne le mois (premier et dernier jour)
            createDate: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
            //$gte, $lte sont des commandes MondoDB
            //"$gte" : greater than or equals, "$lte" : less than or equals) et "$ne" : not equal to
            status: { $ne: "annulée" }
            //$ne commande MongoDB (not equal to)
            });

        //Initialisation du C.A.
        let totalRevenue: number = 0;
        
        // Parcourir les commandes pour calculer le chiffre d'affaires
        for (const order of orders) {
            for (const item of order.products) {
                const product = await ProductsSchema.findById(item.productId);
                if (product) {
                    const priceAfterDiscount = product.prixUnitaire * ((100 - item.discount) / 100);
                    console.log (product.prixUnitaire, item.discount);
                    totalRevenue += item.quantity * priceAfterDiscount;
                }
            }
        }

        res.status(200).json({ 
            message: "Le C.A. H.T. du mois calculé avec succès d'un montant de : " 
            + parseFloat(totalRevenue.toFixed(2)).toLocaleString('fr-FR', 
            { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €" 
            });

    } catch (err: any) {
        res.status(500).json({ message: "Erreur interne", error: err.message });
    }
}





