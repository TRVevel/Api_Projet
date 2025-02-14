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
    const nameRegex= /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
    const passwordRegex= /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    
  if (!nameRegex.test(name) ||!passwordRegex.test(password) ) {
    if (!nameRegex.test(name)) {
        res.status(400).json({ message: 'Nom invalide, il doit contenir que des lettres' });
    }
    if (!passwordRegex.test(password)) {
      res.status(400).json({ message: 'Mdp invalide, il doit contenir que des lettres, des chiffres, des symboles et 8 caractères' });
    }
    return;
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
export async function getAllUsers(req: Request, res: Response) {
    try {
        const users = await UserSchema.find();
        res.status(200).json(users);
    } catch (err: any) {
        console.error('Erreur lors de la récupération des users : ', err)
        res.status(500).json({ message: 'Erreur lors de la récupération des users' })
        
    }
}

//Modification du rôle d'un utilisateur
export async function updateUserRole(req: Request, res: Response)  {
    try {
        const { id } = req.params;
        const { role } = req.body;
        if ( !role) {
            res.status(400).json({ message: 'Les champs name et role sont obligatoires !' });
            return;
        }
        
        const user = await UserSchema.findByIdAndUpdate(id).exec();
        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé !' });
            return;
        }
        user.role = role;
        await user.save();
        
        res.status(200).json({ message: "Rôle de l'utilisateur mis à jour avec succès !", data: user });
    } catch (error: any) {
        res.status(500).json({ message: 'Erreur interne', error: error.message });
    }
}
