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
exports.delOrderInHistory = exports.addOrderInHistory = exports.updateCustomer = void 0;
exports.getAllCustomers = getAllCustomers;
exports.createCustomer = createCustomer;
exports.getActiveCustomer = getActiveCustomer;
exports.updateCustomerActivity = updateCustomerActivity;
const CustomerSchema_1 = __importDefault(require("../DBSchemas/CustomerSchema"));
function getAllCustomers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const customers = yield CustomerSchema_1.default.find();
            res.status(200).json(customers);
        }
        catch (err) {
            console.error('Erreur lors de la récupération des customers : ', err);
            res.status(500).json({ message: 'Erreur lors de la récupération des customers' });
        }
    });
}
function createCustomer(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, adress, email, phone } = yield req.body;
            if (!name || !adress || !email || !phone) {
                res.status(400).json({ message: 'Tous les champs sont requis : name, adress, email, phone,', name, adress, email, phone });
                return;
            }
            const nameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
            const adressRegex = /^[a-zA-Z0-9\s,'-]*$/;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^(0|\+33)[1-9]([-. ]?[0-9]{2}){4}$/;
            if (!nameRegex.test(name) || !adressRegex.test(adress) || !emailRegex.test(email) || !phoneRegex.test(phone)) {
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
            const newCustomer = new CustomerSchema_1.default({ name, adress, email, phone });
            const savedCustomer = yield newCustomer.save();
            res.status(201).json({ message: 'Customer créé avec succès', data: savedCustomer });
        }
        catch (err) {
            if (err.code === 11000) {
                res.status(400).json({ message: 'déjà utilisé' });
                return;
            }
            res.status(500).json({ message: 'Erreur interne', error: err.message });
            return;
        }
    });
}
const updateCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, adress, email, phone } = req.body;
        if (!id) {
            res.status(400).send("Invalid ID");
            return;
        }
        const customer = yield CustomerSchema_1.default.findById(id).exec();
        if (!customer) {
            res.status(404).send("Customer pas trouver");
            return;
        }
        const nameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
        const adressRegex = /^[a-zA-Z0-9\s,'-]*$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^(0|\+33)[1-9]([-. ]?[0-9]{2}){4}$/;
        if (!nameRegex.test(name) || !adressRegex.test(adress) || !emailRegex.test(email) || !phoneRegex.test(phone)) {
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
        const updatedCustomer = yield CustomerSchema_1.default.findByIdAndUpdate(id, { name, adress, email, phone }, { new: true }).exec();
        if (!updatedCustomer) {
            res.status(404).send("Customer pas trouver");
            return;
        }
        res.status(200).json(updatedCustomer);
    }
    catch (err) {
        res.status(500).send("Une erreur est survenu lors de la modification de la Customer");
        return;
    }
});
exports.updateCustomer = updateCustomer;
function getActiveCustomer(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const customers = yield CustomerSchema_1.default.find({ isActive: true });
            res.status(200).json(customers);
        }
        catch (err) {
            console.error('Erreur lors de la récupération des customers : ', err);
            res.status(500).json({ message: 'Erreur lors de la récupération des customers', error: err.message });
            return;
        }
    });
}
;
function updateCustomerActivity(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { isActive } = req.body;
            if (!id) {
                res.status(400).send("Invalid ID");
                return;
            }
            const customer = yield CustomerSchema_1.default.findById(id).exec();
            if (!customer) {
                res.status(404).send("Customer pas trouver");
                return;
            }
            const updatedCustomer = yield CustomerSchema_1.default.findByIdAndUpdate(id, { isActive }, { new: true }).exec();
            if (!updatedCustomer) {
                res.status(404).send("Customer pas trouver");
                return;
            }
            res.status(200).json(updatedCustomer);
        }
        catch (err) {
            res.status(500).send("Une erreur est survenu lors de la modification de la Customer");
            return;
        }
    });
}
;
const addOrderInHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { order } = req.body;
        const user = req.headers.user ? JSON.parse(req.headers.user) : null;
        if (!id) {
            res.status(400).send("Invalid ID");
            return;
        }
        const customer = yield CustomerSchema_1.default.findById(id).exec();
        if (!customer) {
            res.status(404).send("Customer pas trouver");
            return;
        }
        if (customer.id !== user.id) {
            res.status(403).send("Ce n'est pas votre customer");
            return;
        }
        customer.orderHistory.push(order);
        const updatedCustomer = yield customer.save();
        res.status(200).json(updatedCustomer);
    }
    catch (err) {
        res.status(500).send("Une erreur est survenu lors de l'ajout de la Order au Customer");
        return;
    }
});
exports.addOrderInHistory = addOrderInHistory;
const delOrderInHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, idOrder } = req.params;
        const user = req.headers.user ? JSON.parse(req.headers.user) : null;
        console.log("id customer", id, "id order", idOrder);
        if (!id) {
            res.status(400).send("Invalid ID");
            return;
        }
        const customer = yield CustomerSchema_1.default.findById(id).exec();
        if (!customer) {
            res.status(404).send("Customer pas trouver");
            return;
        }
        if (customer.id !== user.id) {
            res.status(403).send("Ce n'est pas votre customer");
            return;
        }
        const index = customer.orderHistory.indexOf(idOrder);
        customer.orderHistory.splice(index, 1);
        const updatedCustomer = yield customer.save();
        res.status(200).json(updatedCustomer);
    }
    catch (err) {
        res.status(500).send("Une erreur est survenu lors de la suppression de la Order à Customer");
        return;
    }
});
exports.delOrderInHistory = delOrderInHistory;
