import {Request, Response} from 'express'
import User from '../models/userSchema'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken';
import { secret } from '../config/auth.secret';


export default class UserController {
    createUser = async(req: Request, res: Response) => {
        const {name, username, email, password} = req.body
        try {
            const userExists = await User.findOne({username})
            const emailExists = await User.findOne({email})
            if(userExists) {
                return res.status(400).json({message: "Username já existe"})
            }
            if(emailExists) {
                return res.status(400).json({message: "email já existe"})
            }
            const hashedPassword = bcrypt.hashSync(password, 10);
            await User.create({
                name,
                username,
                email,
                password: hashedPassword
            });
            return res.status(200).json({message: "Usuário criado com sucesso"})
        } catch (error) {
            return res.status(400).json({message: "Falha em criar usuário"})
        }
    }
    getAllUsers = async(req: Request, res: Response) => {
        try {
            const response = await User.find();
            res.status(200).json(response);
        } catch (error) {
            res.status(400).json({message: "Falha em listar usuários"})
        }
    }
    getOneUser = async(req: Request, res: Response) => {
        try {
            const userExists = await User.findById(req.params.userId);
            return res.status(200).json(userExists)
        } catch (error) {
            return res.status(400).json({message: "Erro ao listar usuário"})   
        }
    }
    loginUser = async(req: Request, res: Response) => {
        const {email, password} = req.body
        try {
            const userExists = await User.findOne({email})
            if(!userExists) {
                return res.status(400).json({message: "Usuário não encontrado"})
            }
            const result = bcrypt.compareSync(password, userExists.password);
            if (result) {
                const token = jwt.sign({ id: userExists._id }, secret, {
                    expiresIn: 86400 // 24 hours
                });
                return res.status(200).json({
                    auth: true,
                    token: token,
                    result: userExists
                })
            } else {
                return res.status(400).json({message: "Senha está incorreta"})
            }

        } catch (error) {
            return res.status(400).json({message: "Falha em logar usuário"})
        }
    }
}

