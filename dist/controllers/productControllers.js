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
exports.updateProduct = void 0;
exports.getAllProducts = getAllProducts;
exports.createProduct = createProduct;
const ProductSchema_1 = __importDefault(require("../DBSchemas/ProductSchema"));
function getAllProducts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const products = yield ProductSchema_1.default.find();
            res.status(200).json(products);
        }
        catch (err) {
            console.error('Erreur lors de la récupération des products : ', err);
            res.status(500).json({ message: 'Erreur lors de la récupération des products' });
        }
    });
}
function createProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, description, price, stock } = yield req.body;
            const nameRegex = /^[a-zA-Z0-9\s\-_]+$/;
            const descriptionRegex = /^.{10,}$/;
            const priceRegex = /^(?!0(?:\.0+)?$)\d+(\.\d+)?$/;
            const stockRegex = /^[1-9]\d*$/;
            if (!name || !nameRegex.test(name) ||
                !description || !descriptionRegex.test(description) ||
                !price || !priceRegex.test(price.toString()) ||
                !stock || !stockRegex.test(stock.toString())) {
                res.status(400).json({
                    message: "Tous les champs sont requis et doivent être valides :",
                    errors: {
                        name: "Le nom doit contenir uniquement des lettres, chiffres et - _",
                        description: "La description doit contenir au moins 10 caractères",
                        price: "Le prix doit être un nombre supérieur ou égal à 1",
                        stock: "Le stock doit être un entier supérieur ou égal à 1",
                    },
                });
                return;
            }
            const newProduct = new ProductSchema_1.default({ name, description, price, stock });
            const savedProduct = yield newProduct.save();
            res.status(201).json({ message: 'Product créé avec succès', data: savedProduct });
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
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, description, price, stock } = req.body;
        if (!id) {
            res.status(400).send("Invalid ID");
            return;
        }
        const product = yield ProductSchema_1.default.findById(id).exec();
        if (!product) {
            res.status(404).send("Product pas trouver");
            return;
        }
        const nameRegex = /^[a-zA-Z0-9\s\-_]+$/;
        const descriptionRegex = /^.{10,}$/;
        const priceRegex = /^(?!0(?:\.0+)?$)\d+(\.\d+)?$/;
        const stockRegex = /^[0-9]\d*$/;
        if ((name && !nameRegex.test(name)) ||
            (description && !descriptionRegex.test(description)) ||
            (price && !priceRegex.test(price.toString())) ||
            (stock !== undefined && !stockRegex.test(stock.toString()))) {
            res.status(400).json({
                message: "Certains champs sont invalides :",
                errors: {
                    name: "Le nom doit contenir uniquement des lettres, chiffres et - _",
                    description: "La description doit contenir au moins 10 caractères",
                    price: "Le prix doit être un nombre supérieur ou égal à 1",
                    stock: "Le stock doit être un entier positif ou 0",
                },
            });
            return;
        }
        const updatedProduct = yield ProductSchema_1.default.findByIdAndUpdate(id, { name, description, price, stock }, { new: true }).exec();
        if (!updatedProduct) {
            res.status(404).send("Product pas trouver");
            return;
        }
        res.status(200).json(updatedProduct);
    }
    catch (err) {
        res.status(500).send("Une erreur est survenu lors de la modification de la Product");
        return;
    }
});
exports.updateProduct = updateProduct;
