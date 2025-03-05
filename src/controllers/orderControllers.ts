import { Request, Response } from "express";
import OrderSchema, { IOrder, Status } from "../DBSchemas/OrderSchema";
import ProductSchema, { IProduct } from "../DBSchemas/ProductSchema";
import CustomerSchema from "../DBSchemas/CustomerSchema";

   export async function getAllOrders(req: Request, res: Response) {
    try {
        const orders = await OrderSchema.find();
        res.status(200).json(orders);
    } catch (err: any) {
        console.error('Erreur lors de la récupération des orders : ', err)
        res.status(500).json({ message: 'Erreur lors de la récupération des orders' })
        
    }
}
export async function createOrder(req: Request, res: Response) {
    try {
        const { customer, productList, quantityList } = req.body;

        if (!customer || !productList || !quantityList) {
            res.status(400).json({  message: 'Tous les champs sont requis : customer, productList, quantityList' })
            return;
        }

        if (productList.length !== quantityList.length) {
            res.status(400).json({ message: 'Les listes de produits, prix unitaires et quantités doivent avoir la même longueur' });
            return;
        }

        let totalPrice = 0;
        const productsToUpdate = [];
        let unitPriceList=[];
       
        for (let i = 0; i < productList.length; i++) {
            const product = await ProductSchema.findById(productList[i]);
            
            if (!product) {
                res.status(404).json({ message: `Produit introuvable: ${productList[i]}` });
                return;
            }
            unitPriceList[i] = product.price;
            if (!unitPriceList) {
                res.status(400).json({ message: `Pas de Prix trouver pour le produit: ${product.name} Id du produit: ${productList[i]} ` }) 
                return;
            }
            if (product.stock < quantityList[i]) {
                res.status(400).json({ message: `Stock insuffisant pour le produit: ${product.name} (Stock: ${product.stock}, Requis: ${quantityList[i]})` }) 
                return;
            }
            
            totalPrice += unitPriceList[i] * quantityList[i];

            product.stock -= quantityList[i];
            productsToUpdate.push(product);
        }

        const newOrder: IOrder = new OrderSchema({
            customer,
            productList,
            unitPriceList,
            quantityList,
            ttPrice: totalPrice
        });

        await newOrder.save();
        await Promise.all(productsToUpdate.map((product) => product.save()));
        const customerTable = await CustomerSchema.findById(customer).exec();
      
      if (!customerTable) {
        res.status(404).send("Customer pas trouver");
        return;
      }
      customerTable.orderHistory.push(newOrder._id as string);
        await customerTable.save();
        res.status(201).json({ message: 'Commande créée avec succès', data: newOrder });
        return;

    } catch (err: any) {
        console.error('Erreur lors de la création de la commande:', err);
        res.status(500).json({ message: 'Erreur interne', error: err.message });
        return;
    }
}

    
export const cancelOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      res.status(400).send("Invalid ID");
      return;
    }
    const order = await OrderSchema.findById(id).exec();
    
    if (!order) {
      res.status(404).send("Order pas trouver");
      return;
    }
    if (order.status === 'cancelled') {
        res.status(400).json({ message: 'La commande est déjà annulée' });
        return;
      }
      if (order.status === 'delivered') {
        res.status(400).json({ message: 'La commande ne peut être annulée' });
        return;
      }
      const customer = await CustomerSchema.findById(order.customerId).exec();
      
      if (!customer) {
        res.status(404).send("Customer pas trouver");
        return;
      }

      const productsToUpdate: IProduct[] = [];

      for (let i = 0; i < order.productIdList.length; i++) {
        const product = await ProductSchema.findById(order.productIdList[i]);
  
        if (!product) {
          res.status(404).json({ message: `Produit introuvable: ${order.productIdList[i]}` });
          return;
        }
        
        product.stock += order.quantityList[i];
        productsToUpdate.push(product);
      }
      
      order.status = Status.cancelled;
      if (!customer.orderHistory.includes(id)) {
        res.status(404).json({ message: `Historique de commande introuvable: ${order}` });
        return;
      }
      customer.orderHistory.splice(customer.orderHistory.indexOf(id), 1);
      order.modifiedAt = new Date();
      await order.save();
      await customer.save();
      await Promise.all(productsToUpdate.map((product) => product.save()));

      
  
      res.status(201).json({ message: 'Commande annulée avec succès', data: order });
    } catch (err) {
      res.status(500).send("Une erreur est survenue lors de la modification de la commande");
    }
  };

  export const modifyOrderStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).send("Invalid ID");
        return;
      }
      const order = await OrderSchema.findById(id).exec();
      if (!order) {
        res.status(404).send("Order pas trouver");
        return;
      }
        if(order.status ==='cancelled'){
            res.status(400).json({ message: `Impossible la commande est : ${order.status}` });
            return;
        }else if(order.status ==='delivered'){
            res.status(400).json({ message: `La commande est déjà : ${order.status}` });
            return;
        }else if(order.status ==='shipped'){
            order.status = Status.delivered;
        }else if(order.status ==='pending'){
            order.status = Status.shipped;
        }
        
        order.modifiedAt = new Date();
        await order.save();
  
        res.status(201).json({ message: 'Commande annulée avec succès', data: order });
      } catch (err) {
        res.status(500).send("Une erreur est survenue lors de la modification de la commande");
      }
    };

    export async function listOrdersByCustomer(req: Request, res: Response) {
      try {
          const { customerId } = req.params;
  
          // Vérification de l'existence du client
          const customer = await CustomerSchema.findById(customerId);
          if (!customer) {
              res.status(404).json({ message: "ATTENTION : Ce client n'existe pas !" });
              return;
          }
  
          // Récupération des commandes du client
          const orders = await OrderSchema.find({ customerId });
          console.log(orders)
          
  
          res.status(200).json({ message: "le client Id = '" + customerId + "' nom = '" + customer.name + "' a passé " + orders.length + " commandes qui sont :", data: orders });
      } catch (err: any) {
          res.status(500).json({ message: "Erreur interne", error: err.message });
      }
  }