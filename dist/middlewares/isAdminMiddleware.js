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
exports.isAdminMiddleware = isAdminMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserSchema_1 = __importDefault(require("../DBSchemas/UserSchema"));
function isAdminMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const cookie = req.headers.cookie;
            if (!cookie) {
                res.status(401).json({ message: 'Accès refusé. Token manquant.' });
                return;
            }
            const token = cookie.split('=')[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);
            const user = yield UserSchema_1.default.findById(decoded.id);
            if (!user || user.role !== 'admin') {
                res.status(403).json({ message: 'Accès refusé. Vous devez être Admin !' });
                return;
            }
            next();
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: "Erreur d'authentification", error: error.message });
            }
            else {
                res.status(500).json({ message: "Erreur d'authentification", error: String(error) });
            }
        }
    });
}
;
