import { Request, Response } from "express";
import CustomerSchema, { ICustomer } from "../DBSchemas/CustomerSchema";

   export async function getAllCustomers(req: Request, res: Response) {
    try {
        const customers = await CustomerSchema.find();
        res.status(200).json(customers);
    } catch (err: any) {
        console.error('Erreur lors de la récupération des customers : ', err)
        res.status(500).json({ message: 'Erreur lors de la récupération des customers' })
        
    }
}
   export async function createCustomer(req: Request, res: Response) {
    try {
     const { name, adress, email, phone} = await req.body;

    if (!name ||!adress || !email || !phone ) {
       res.status(400).json({ message: 'Tous les champs sont requis : name, adress, email, phone,', name, adress, email, phone});
    return;
    }
    
    const nameRegex= /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
    const adressRegex= /^[a-zA-Z0-9\s,'-]*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(0|\+33)[1-9]([-. ]?[0-9]{2}){4}$/;
  if (!nameRegex.test(name) ||!adressRegex.test(adress) || !emailRegex.test(email) || !phoneRegex.test(phone) ) {
    if (!nameRegex.test(name)) {
        res.status(400).json({ message: 'Nom invalide, il doit contenir que des lettres' });
    }
    if (!adressRegex.test(adress)) {
      res.status(400).json({ message: 'Adresse invalide, elle doit contenir que des lettres, des chiffres et des espaces' });
    }
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: 'Adresse email invalide, elle doit etre sous cette forme unexemple@exemple.ex' }); 
    }
    if (!phoneRegex.test(phone)) {
      res.status(400).json({ message: 'Numéro de téléphone invalide, il doit etre sous cette forme 0X XX XX XX XX ou +33 X XX XX XX XX' });
    }
    return;
  }
    
    const newCustomer: ICustomer = new CustomerSchema ({ name, adress, email, phone});
    
    const savedCustomer = await newCustomer.save();
    
    res.status(201).json({ message: 'Customer créé avec succès', data: savedCustomer });
    } catch (err: any) {
    
    if (err.code === 11000) {
    res.status(400).json({ message: 'déjà utilisé'});
    return;
    }
    res.status(500).json({ message: 'Erreur interne', error: err.message });
    return;
    }
}
    
export const updateCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, adress, email, phone} = req.body;
    
    if (!id) {
      res.status(400).send("Invalid ID");
      return;
    }
    const customer = await CustomerSchema.findById(id).exec();
    if (!customer) {
      res.status(404).send("Customer pas trouver");
      return;
    }
    
    const nameRegex= /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
    const adressRegex= /^[a-zA-Z0-9\s,'-]*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(0|\+33)[1-9]([-. ]?[0-9]{2}){4}$/;
  if (!nameRegex.test(name) ||!adressRegex.test(adress) || !emailRegex.test(email) || !phoneRegex.test(phone) ) {
    if (!nameRegex.test(name)) {
        res.status(400).json({ message: 'Nom invalide, il doit contenir que des lettres' });
    }
    if (!adressRegex.test(adress)) {
      res.status(400).json({ message: 'Adresse invalide, elle doit contenir que des lettres, des chiffres et des espaces' });
    }
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: 'Adresse email invalide, elle doit etre sous cette forme unexemple@exemple.ex' }); 
    }
    if (!phoneRegex.test(phone)) {
      res.status(400).json({ message: 'Numéro de téléphone invalide, il doit etre sous cette forme 0X XX XX XX XX ou +33 X XX XX XX XX' });
    }
    return;
  }


    const updatedCustomer = await CustomerSchema.findByIdAndUpdate(
      id,
      { name, adress, email, phone},
      { new: true }
    ).exec();

    if (!updatedCustomer) {
      res.status(404).send("Customer pas trouver");
      return;
    }
    
    res.status(200).json(updatedCustomer);
  } catch (err) {
    res.status(500).send("Une erreur est survenu lors de la modification de la Customer");
    return;
  }
};
export async function getActiveCustomer(req: Request, res: Response) {
    try {
        const customers = await CustomerSchema.find({ isActive: true });
        res.status(200).json(customers);
    } catch (err: any) {
        console.error('Erreur lors de la récupération des customers : ', err)
        res.status(500).json({ message: 'Erreur lors de la récupération des customers', error: err.message})
        return;
    }
};
export async function updateCustomerActivity(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { isActive} = req.body;
    
    if (!id) {
      res.status(400).send("Invalid ID");
      return;
    }
    const customer = await CustomerSchema.findById(id).exec();
    if (!customer) {
      res.status(404).send("Customer pas trouver");
      return;
    }

    const updatedCustomer = await CustomerSchema.findByIdAndUpdate(
      id,
      { isActive},
      { new: true }
    ).exec();

    if (!updatedCustomer) {
      res.status(404).send("Customer pas trouver");
      return;
    }
    
    res.status(200).json(updatedCustomer);
  } catch (err) {
    res.status(500).send("Une erreur est survenu lors de la modification de la Customer");
    return;
  }
};
export const addOrderInHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { order } = req.body;
      const user = req.headers.user ? JSON.parse(req.headers.user as string) : null;
  
      if (!id) {
        res.status(400).send("Invalid ID");
        return;
      }
  
      const customer = await CustomerSchema.findById(id).exec();
      if (!customer) {
        res.status(404).send("Customer pas trouver");
        return;
      }
  
      if (customer.id !== user.id) {
        res.status(403).send("Ce n'est pas votre customer");
        return;
      }
  
      customer.orderHistory.push(order);
  
      const updatedCustomer = await customer.save();
  
      res.status(200).json(updatedCustomer);
    } catch (err) {
      res.status(500).send("Une erreur est survenu lors de l'ajout de la Order au Customer");
      return;
    }
  };
export const delOrderInHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, idOrder } = req.params;
      const user = req.headers.user ? JSON.parse(req.headers.user as string) : null;
      console.log("id customer",id,"id song",idOrder);
      if (!id) {
        res.status(400).send("Invalid ID");
        return;
      }
  
      const customer = await CustomerSchema.findById(id).exec();
      if (!customer) {
        res.status(404).send("Customer pas trouver");
        return;
      }
  
      if (customer.id !== user.id) {
        res.status(403).send("Ce n'est pas votre customer");
        return;
      }
  const index = customer.orderHistory.indexOf(idOrder);
      customer.orderHistory.splice(index,1);
  
      const updatedCustomer = await customer.save();
  
      res.status(200).json(updatedCustomer);
    } catch (err) {
      res.status(500).send("Une erreur est survenu lors de la suppression de la Order à Customer");
      return;
    }
  };