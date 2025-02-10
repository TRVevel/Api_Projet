import { Request, Response, Router } from 'express';
import { hashPassword, verifyPassword } from '../utils/pwdUtils';
import UserSchema, { IUser } from '../DBSchemas/UserSchema';
import { generateToken } from '../utils/JWTUtils';

//Création d'un utilisateur
export async function register(req:Request, res:Response){
    try{
    const { name, password } = req.body;
    if(!name || !password ){
        res.status(400).send('ATTENTION : les champs "name" et "password" sont obligatoires !');
        return 
    }
    //hashage
    const hashedPassword= await hashPassword(password);

    //creer nouvel utilisateur
    const newUser:IUser= new UserSchema({name,hashedPassword});
    //on sauvegarde
    const savedUser= await newUser.save();

    //on supprime le hashed password
    savedUser.hashedPassword='';

    res.status(201).json({message: 'Utilisateur créé avec succès',data: savedUser});
} catch(err:any){
    //erreur de duplication 
    if(err.code===11000){
        res.status(400).json({message: 'Cet utilisateur existe déjà !'});
        return 
    }
    res.status(500).json({message: 'Erreur interne', error: err.message});

    }
}

//Connexion d'un utilisateur
export async function login(req:Request, res:Response){
    const {name,password}=req.body;
    try{
         const user= await  UserSchema.findOne({name});
            if(!user){
                res.status(404).json({message: 'Utilisateur non trouvé'});
                return 
            }
            const isPasswordValid= await verifyPassword(password,user.hashedPassword);

            if(!isPasswordValid){
                res.status(401).json({message: 'Mot de passe incorrect'});
                return 
            }
            const token = generateToken({id:user._id,name:user.name});
            res.cookie('jwt',token,{httpOnly:true, sameSite:'strict'});
            res.status(200).json({message: 'Connexion réussie'});

    }catch(error:any){
        res.status(500).json({message: error.message});
    }
}

//Modification du rôle d'un utilisateur
export async function updateUserRole(req: Request, res: Response)  {
    try {
        const { name, newRole } = req.body;
        if (!name || !newRole) {
            res.status(400).json({ message: 'Les champs name et newRole sont obligatoires !' });
            return;
        }
        
        const user = await UserSchema.findOne({ name });
        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé !' });
            return;
        }
        user.role = newRole;
        await user.save();
        
        res.status(200).json({ message: "Rôle de l'utilisateur mis à jour avec succès !", data: user });
    } catch (error: any) {
        res.status(500).json({ message: 'Erreur interne', error: error.message });
    }
}
