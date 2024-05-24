import { Router } from 'express';

import { UserController } from '../controllers/user.controller';

const userController = new UserController();

export default (router: Router) => {
    router.post('/signup', userController.signUp);
    router.post('/login', userController.login);
};
