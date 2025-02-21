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
exports.register = register;
exports.login = login;
exports.getAllUsers = getAllUsers;
exports.updateUserRole = updateUserRole;
const pwdUtils_1 = require("../utils/pwdUtils");
const UserSchema_1 = __importDefault(require("../DBSchemas/UserSchema"));
const JWTUtils_1 = require("../utils/JWTUtils");
const joiUtils_1 = require("../utils/joiUtils");
const authValidators_1 = require("../JoiValidators/authValidators");
//Création d'un utilisateur
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, password } = req.body;
            if (!name || !password) {
                res.status(400).send('ATTENTION : les champs "name" et "password" sont obligatoires !');
                return;
            }
            const nameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
            const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
            if (!nameRegex.test(name) || !passwordRegex.test(password)) {
                if (!nameRegex.test(name)) {
                    res.status(400).json({ message: 'Nom invalide, il doit contenir que des lettres' });
                }
                if (!passwordRegex.test(password)) {
                    res.status(400).json({ message: 'Mdp invalide, il doit contenir que des lettres, des chiffres, des symboles et 8 caractères' });
                }
                return;
            }
            //hashage
            const hashedPassword = yield (0, pwdUtils_1.hashPassword)(password);
            //creer nouvel utilisateur
            const newUser = new UserSchema_1.default({ name, hashedPassword });
            //on sauvegarde
            const savedUser = yield newUser.save();
            //on supprime le hashed password
            savedUser.hashedPassword = '';
            res.status(201).json({ message: 'Utilisateur créé avec succès', data: savedUser });
        }
        catch (err) {
            //erreur de duplication 
            if (err.code === 11000) {
                res.status(400).json({ message: 'Cet utilisateur existe déjà !' });
                return;
            }
            res.status(500).json({ message: 'Erreur interne', error: err.message });
        }
    });
}
//Connexion d'un utilisateur
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, password } = (0, joiUtils_1.validateSchema)(req, authValidators_1.loginSchema);
        try {
            const user = yield UserSchema_1.default.findOne({ name });
            if (!user) {
                res.status(404).json({ message: 'Utilisateur non trouvé' });
                return;
            }
            const isPasswordValid = yield (0, pwdUtils_1.verifyPassword)(password, user.hashedPassword);
            if (!isPasswordValid) {
                res.status(401).json({ message: 'Mot de passe incorrect' });
                return;
            }
            const token = (0, JWTUtils_1.generateToken)({ id: user._id, name: user.name });
            res.cookie('jwt', token, { httpOnly: true, sameSite: 'strict' });
            res.status(200).json({ message: 'Connexion réussie' });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
}
function getAllUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield UserSchema_1.default.find();
            res.status(200).json(users);
        }
        catch (err) {
            console.error('Erreur lors de la récupération des users : ', err);
            res.status(500).json({ message: 'Erreur lors de la récupération des users' });
        }
    });
}
//Modification du rôle d'un utilisateur
function updateUserRole(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { role } = req.body;
            if (!role) {
                res.status(400).json({ message: 'Les champs name et role sont obligatoires !' });
                return;
            }
            const user = yield UserSchema_1.default.findByIdAndUpdate(id).exec();
            if (!user) {
                res.status(404).json({ message: 'Utilisateur non trouvé !' });
                return;
            }
            user.role = role;
            yield user.save();
            res.status(200).json({ message: "Rôle de l'utilisateur mis à jour avec succès !", data: user });
        }
        catch (error) {
            res.status(500).json({ message: 'Erreur interne', error: error.message });
        }
    });
}
