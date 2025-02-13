import { Request, Response } from "express";
import CustomersSchema, { CustomerI } from "../DBSchemas/CustomersSchema";

//Création d'un client
export async function createCustomer(req:Request, res:Response){
    try{
    const { email, name, address, phone } = req.body;
    if(!email || !name || !address || !phone ){
        res.status(400).send('ATTENTION : les champs email, name, address et phone sont obligatoires !');
        return 
    }
    
    //création d'un nouveau client 
    const newUser:CustomerI= new CustomersSchema({ email, name, address, phone });
    
    //sauvegarde de l'utilisateur créé
    const savedUser= await newUser.save();

    res.status(201).json({message: 'Client créé avec succès !',data: savedUser});
    } catch(err:any){
        //erreur de duplication 
        if(err.code===11000){
            res.status(400).json({message: 'Ce client existe déjà !'});
        return 
        }
        res.status(500).json({message: 'Erreur interne', error: err.message});
        }
}

// Modification d'un client (sans modification du statut actif)
export async function updateCustomer(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { name, email, address, phone, active, ...rest } = req.body; // Exclure `active`

        //Vérifier si l'email du client est passé en paramètre 
        if (!id){
            res.status(400).json({ message: "Aucun id n'est passé en paramètre !" });
            return;
        }

        // Vérifier si l'utilisateur essaie de modifier `active`
        if (active !== undefined) {
            res.status(403).json({ message: "Modification du statut interdite par cette route." });
            return;
        }

        // Mise à jour des autres champs
        const updatedCustomer = await CustomersSchema.findOneAndUpdate(
            { id },
            { name, email, address, phone, ...rest },
            { new: true, runValidators: true }
        );

        if (!updatedCustomer) {
            res.status(404).json({ message: "Client non trouvé." });
            return;
            }
        res.status(200).json({ message: "Client mis à jour avec succès.", data: updatedCustomer });
        } catch (err: any) {
            res.status(500).json({ message: "Erreur interne", error: err.message });
        }
    }

//Rendre un client inactif (admin seulement)
export async function updateStatusCustomer(req: Request, res: Response) {
    try {
        const { email } = req.params;
        const { active } = req.body;

        //Vérifier si l'email du client est passé en paramètre 
        if (!email){
            res.status(400).json({ message: "Aucun email n'est passé en paramètre !" });
            return;
        }

        // Vérifier si l'utilisateur essaie de modifier `active`
        if (active === undefined) {
            res.status(400).json({ message: "Le statut actif est requis." });
            return;
        }

        // Mise à jour du statut actif
        const updatedCustomer = await CustomersSchema.findOneAndUpdate(
            { email },
            { active: false }
        );

        if (!updatedCustomer) {
            res.status(404).json({ message: "Client non trouvé." });
            return;
        }
        res.status(200).json({ message: "Statut du client mis à jour avec succès.", data: updatedCustomer });
    } catch (err: any) {
        res.status(500).json({ message: "Erreur interne", error: err.message });
    }
}

//Liste des client avec "active" à true
export async function getActiveCustomers(req: Request, res: Response) {
    try {
        const customers = await CustomersSchema.find({ active: true });
        res.status(200).json({ message: "Les clients actifs sont au nombre de " + customers.length + " et sont : ",customers })
        
    } catch (err: any) {
        res.status(500).json({ message: "Erreur interne", error: err.message });
    }
}