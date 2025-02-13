import { Request, Response } from "express";
import ProductsSchema, { ProductI } from "../DBSchemas/ProductsSchema";

//Création d'un produit
export async function createProduct(req:Request, res:Response){
    try{
        const { name, description, prixUnitaire, stock } = req.body;
        if(!name || !prixUnitaire || !stock ){
        res.status(400).send("ATTENTION : les champs name, prix unitaire et stock sont obligatoires !");
        return 
    }

    //création d'un nouveau produit
    const newProduct:ProductI= new ProductsSchema({name,description, prixUnitaire, stock});
    
    //sauvegarde du produit créé
    const savedProduct= await newProduct.save();

    res.status(201).json({message: 'Produit créé avec succès',data: savedProduct});
} catch(err:any){
    //erreur de duplication 
    if(err.code===11000){
        res.status(400).json({message: 'Ce produit existe déjà !'});
        return 
    }
    res.status(500).json({message: 'Erreur interne', error: err.message});

    }
}

// Consulter un produit
export async function getAProduct(req: Request, res: Response) { 
    try {
        const { name } = req.params;
        if(!name ){
            res.status(400).send('ATTENTION : le champs nom produit est obligatoire !');
            return 
        }
        const product = await ProductsSchema.findOne({ name });
        if (!product) {
            res.status(404).json({ message: 'Produit non trouvé' });
            return;
        }
        res.status(200).json({ message: 'Produit trouvé', data: product });
    } catch (error: any) {
        res.status(500).json({ message: 'Erreur interne', error: error.message });
    }
}

// Supprimer un produit
export async function DeleteAProduct(req: Request, res: Response) { 
    try {
        const { name } = req.params;
        if(!name ){
            res.status(400).send('ATTENTION : le champs nom produit est obligatoire !');
            return 
        }
        const product = await ProductsSchema.findOneAndDelete({ name });
        if (!product) {
            res.status(404).json({ message: name + " non trouvé !" });
            return;
        }
        res.status(200).json({ message: 'Produit supprimé !', data: product });
    } catch (error: any) {
        res.status(500).json({ message: 'Erreur interne', error: error.message });
    }
}

// Liste de tous les produits
export async function getAllProducts(req: Request, res: Response) {
    try {
        const products = await ProductsSchema.find();
        res.status(200).json({ message: "La base de données contient " + products.length + " produits qui sont : ", data: products });
    } catch (error: any) {
        res.status(500).json({ message: 'Erreur interne', error: error.message });
    }
}

