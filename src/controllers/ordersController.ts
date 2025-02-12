import { Request, Response } from "express";
import OrdersSchema, { OrderI} from "../DBSchemas/OrdersSchema";
import ProductsSchema from "../DBSchemas/ProductsSchema";
import CustomersSchema from "../DBSchemas/CustomersSchema";

//Création d'une commande
export async function createOrder (req: Request, res: Response) {
    try{
        const { numOrder, customerId, products } = req.body;
        
        //Validation des champs
        if(!numOrder || !customerId ){
        res.status(400).send("ATTENTION : les champs numéro de commande et le customerId sont obligatoires !");
        return 
        }

        //Vérifier si la commande existe déjà
        const order = await OrdersSchema.findOne({numOrder})
        if (order){
            res.status(400).json({message: "ATTENTION : cette commande existe déjà !"});
            return
        }

        //Vérifier l'existence du client
        const customer = await CustomersSchema.findById(customerId);
        if (!customer) {
            res.status(404).json({ message: "ATTENTION : Ce client n'existe pas !" });
            return;
        }

        //Vérifier que la commande contient au moins 1 produit
        if (!Array.isArray(products) || products.length===0){
            res.status(400).json({ message: "ATTENTION : La commande doit contenir au moins un produit !" });
            return
        }

        let totalCommande :number= 0;

        // Vérification du stock-produit disponible et sa mise à jour
        for (const item of products) {
            const product = await ProductsSchema.findById(item.productId);
            if (!product) {
                res.status(400).json({ message: `Produit avec ID ${item.productId} introuvable !` });
                return;
            }
            if (product.stock < item.quantity) {
                res.status(400).json({ message: `Stock insuffisant pour le produit ${product.name} (ID: ${item.productId})` });
                return;
            }
            // Mise à jour du stock
            product.stock -= item.quantity;
            if (!item.discount){
                item.discount=0;
            }
            await product.save();

            //Calcul du montant total de la commande
            totalCommande += item.quantity * (product.prixUnitaire * ((100-item.discount )/100)); 
        }

        //création de la nouvelle commande
        const newOrder:OrderI= new OrdersSchema({
            numOrder, 
            customerId,
            products,
            status: "En attente"
        });
        
        //sauvegarde de la commande créée
        const savedOrder= await newOrder.save();
    
        const tva=totalCommande*(20/100);
        res.status(201).json({ 
            message: "Commande créée avec succès ! " +
            "Le total HT est de : " + parseFloat(totalCommande.toFixed(2)).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €" +
            " TVA (20%) : " + parseFloat(tva.toFixed(2)).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €, Total TTC : " + 
            parseFloat((totalCommande + tva).toFixed(2)).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €", 
            data: savedOrder 
        });
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
}

//Historique des commandes par client
export async function listOrdersByCustomer(req: Request, res: Response) {
    try {
        const { customerId } = req.params;

        // Vérification de l'existence du client
        const customer = await CustomersSchema.findById(customerId);
        if (!customer) {
            res.status(404).json({ message: "ATTENTION : Ce client n'existe pas !" });
            return;
        }

        // Récupération des commandes du client
        const orders = await OrdersSchema.find({ customerId });

        res.status(200).json({ message: "Historique des commandes récupéré avec succès !", data: orders });
    } catch (err: any) {
        res.status(500).json({ message: "Erreur interne", error: err.message });
    }
}

//Mise à jour du status de la commande ( expédiée ou livrée )
export async function updateOrderStatus(req: Request, res: Response) {
    try {
        const { orderId, status } = req.body;

        // Vérification des champs obligatoires
        if (!orderId || !status) {
            res.status(400).json({ message: "ATTENTION : L'ID de la commande et le statut sont obligatoires !" });
            return;
        }

        // Vérification de l'existence de la commande
        const order = await OrdersSchema.findById(orderId);
        if (!order) {
            res.status(404).json({ message: "ATTENTION : Cette commande est introuvable !" });
            return;
        }

        // Si la commande est annulée, rétablir le stock des produits
        if (status === "annulée") {
            for (const item of order.products) {
                res.status(403).json({ message: "Annulation de la commande interdite par cette route !" });
                return;
            }
        }
        
        // Mise à jour du statut de la commande et de la date statut
        order.status = status;
        order.dateModifyStatus = new Date();
        await order.save();

        res.status(200).json({ message: `Statut de la commande mis à jour avec succès ! Le statut est : (${status})`, data: order });
    } catch (err: any) {
        res.status(500).json({ message: "Erreur interne", error: err.message });
    }
}

//Annulation d'une commande
export async function cancelOrder(req: Request, res: Response) {
    try {
        const { orderId } = req.params;

        // Vérification des champs obligatoires
        if (!orderId ) {
            res.status(400).json({ message: "ATTENTION : L'ID de la commande est obligatoire !" });
            return;
        }

        // Vérification de l'existence de la commande
        const order = await OrdersSchema.findById(orderId);
        if (!order) {
            res.status(404).json({ message: "ATTENTION : Cette commande est introuvable !" });
            return;
        }

        // Rétablir le stock des produits        
        for (const item of order.products) {
            const product = await ProductsSchema.findById(item.productId);
            if (product) {
                product.stock += item.quantity; // Mise à jour du stock
                await product.save();
            }
        }
                
        // Mise à jour du statut de la commande et de sa date statut
        order.status = "annulée";
        order.dateModifyStatus = new Date();
        await order.save();

        res.status(200).json({ message: `La commande a bien été annulée ! Le statut est : (${order.status})`, data: order });
    } catch (err: any) {
        res.status(500).json({ message: "Erreur interne", error: err.message });
    }
}
