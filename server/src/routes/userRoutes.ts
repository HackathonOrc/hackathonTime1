import {Router} from 'express';
import UserController from '../controllers/userController';


const userRoutes = Router();
const userController = new UserController;

userRoutes.post('/', (req , res) => {
    userController.createUser(req, res);
});

userRoutes.get('/', (req, res) => {
    userController.getAllUsers(req,res);
});

export default userRoutes;