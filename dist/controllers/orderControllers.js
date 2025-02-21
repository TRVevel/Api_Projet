"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.modifyOrderStatus = exports.cancelOrder = void 0;
exports.getAllOrders = getAllOrders;
exports.createOrder = createOrder;
exports.listOrdersByCustomer = listOrdersByCustomer;
const OrderSchema_1 = __importStar(require("../DBSchemas/OrderSchema"));
const ProductSchema_1 = __importDefault(require("../DBSchemas/ProductSchema"));
const CustomerSchema_1 = __importDefault(require("../DBSchemas/CustomerSchema"));
function getAllOrders(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const orders = yield OrderSchema_1.default.find();
            res.status(200).json(orders);
        }
        catch (err) {
            console.error('Erreur lors de la récupération des orders : ', err);
            res.status(500).json({ message: 'Erreur lors de la récupération des orders' });
        }
    });
}
function createOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { customer, productList, quantityList } = req.body;
            if (!customer || !productList || !quantityList) {
                res.status(400).json({ message: 'Tous les champs sont requis : customer, productList, quantityList' });
                return;
            }
            if (productList.length !== quantityList.length) {
                res.status(400).json({ message: 'Les listes de produits, prix unitaires et quantités doivent avoir la même longueur' });
                return;
            }
            let totalPrice = 0;
            const productsToUpdate = [];
            let unitPriceList = [];
            for (let i = 0; i < productList.length; i++) {
                const product = yield ProductSchema_1.default.findById(productList[i]);
                if (!product) {
                    res.status(404).json({ message: `Produit introuvable: ${productList[i]}` });
                    return;
                }
                unitPriceList[i] = product.price;
                if (!unitPriceList) {
                    res.status(400).json({ message: `Pas de Prix trouver pour le produit: ${product.name} Id du produit: ${productList[i]} ` });
                    return;
                }
                if (product.stock < quantityList[i]) {
                    res.status(400).json({ message: `Stock insuffisant pour le produit: ${product.name} (Stock: ${product.stock}, Requis: ${quantityList[i]})` });
                    return;
                }
                totalPrice += unitPriceList[i] * quantityList[i];
                product.stock -= quantityList[i];
                productsToUpdate.push(product);
            }
            const newOrder = new OrderSchema_1.default({
                customer,
                productList,
                unitPriceList,
                quantityList,
                ttPrice: totalPrice
            });
            yield newOrder.save();
            yield Promise.all(productsToUpdate.map((product) => product.save()));
            const customerTable = yield CustomerSchema_1.default.findById(customer).exec();
            if (!customerTable) {
                res.status(404).send("Customer pas trouver");
                return;
            }
            customerTable.orderHistory.push(newOrder._id);
            yield customerTable.save();
            res.status(201).json({ message: 'Commande créée avec succès', data: newOrder });
            return;
        }
        catch (err) {
            console.error('Erreur lors de la création de la commande:', err);
            res.status(500).json({ message: 'Erreur interne', error: err.message });
            return;
        }
    });
}
const cancelOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).send("Invalid ID");
            return;
        }
        const order = yield OrderSchema_1.default.findById(id).exec();
        if (!order) {
            res.status(404).send("Order pas trouver");
            return;
        }
        if (order.status === 'cancelled') {
            res.status(400).json({ message: 'La commande est déjà annulée' });
            return;
        }
        const customer = yield CustomerSchema_1.default.findById(order.customerId).exec();
        if (!customer) {
            res.status(404).send("Customer pas trouver");
            return;
        }
        const productsToUpdate = [];
        for (let i = 0; i < order.productIdList.length; i++) {
            const product = yield ProductSchema_1.default.findById(order.productIdList[i]);
            if (!product) {
                res.status(404).json({ message: `Produit introuvable: ${order.productIdList[i]}` });
                return;
            }
            product.stock += order.quantityList[i];
            productsToUpdate.push(product);
        }
        order.status = OrderSchema_1.Status.cancelled;
        if (!customer.orderHistory.includes(id)) {
            res.status(404).json({ message: `Historique de commande introuvable: ${order}` });
            return;
        }
        customer.orderHistory.splice(customer.orderHistory.indexOf(id), 1);
        order.modifiedAt = new Date();
        yield order.save();
        yield customer.save();
        yield Promise.all(productsToUpdate.map((product) => product.save()));
        res.status(201).json({ message: 'Commande annulée avec succès', data: order });
    }
    catch (err) {
        res.status(500).send("Une erreur est survenue lors de la modification de la commande");
    }
});
exports.cancelOrder = cancelOrder;
const modifyOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).send("Invalid ID");
            return;
        }
        const order = yield OrderSchema_1.default.findById(id).exec();
        if (!order) {
            res.status(404).send("Order pas trouver");
            return;
        }
        if (order.status === 'cancelled') {
            res.status(400).json({ message: `Impossible la commande est : ${order.status}` });
            return;
        }
        else if (order.status === 'delivered') {
            res.status(400).json({ message: `La commande est déjà : ${order.status}` });
            return;
        }
        else if (order.status === 'shipped') {
            order.status = OrderSchema_1.Status.delivered;
        }
        else if (order.status === 'pending') {
            order.status = OrderSchema_1.Status.shipped;
        }
        order.modifiedAt = new Date();
        yield order.save();
        res.status(201).json({ message: 'Commande annulée avec succès', data: order });
    }
    catch (err) {
        res.status(500).send("Une erreur est survenue lors de la modification de la commande");
    }
});
exports.modifyOrderStatus = modifyOrderStatus;
function listOrdersByCustomer(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { customerId } = req.params;
            // Vérification de l'existence du client
            const customer = yield CustomerSchema_1.default.findById(customerId);
            if (!customer) {
                res.status(404).json({ message: "ATTENTION : Ce client n'existe pas !" });
                return;
            }
            // Récupération des commandes du client
            const orders = yield OrderSchema_1.default.find({ customerId });
            console.log(orders);
            res.status(200).json({ message: "le client Id = '" + customerId + "' nom = '" + customer.name + "' a passé " + orders.length + " commandes qui sont :", data: orders });
        }
        catch (err) {
            res.status(500).json({ message: "Erreur interne", error: err.message });
        }
    });
}
