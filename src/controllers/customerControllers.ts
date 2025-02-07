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
      res.status(500).send("Une erreur est survenu lors de l'ajout de la chanson à la Customer");
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
      res.status(500).send("Une erreur est survenu lors de l'ajout de la chanson à la Customer");
      return;
    }
  };