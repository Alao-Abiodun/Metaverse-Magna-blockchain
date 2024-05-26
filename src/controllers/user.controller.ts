import { NextFunction, Request, Response } from 'express';
import { successResponse } from '../utils/lib/response';
import { StatusCodes } from 'http-status-codes';
import tryCatch from '../utils/helpers/tryCatch.helper';
import { hashPassword } from "../utils/helpers/bcrypt.helper";
import AppError from '../utils/lib/appError';
import { removePasswordFromObject } from '../utils/helpers/password.helper';
import  { Container, Inject, Service } from 'typedi';
import { UserService } from '../services/user.service';
import { IUser } from '../entities/User';
import { generateJwtToken } from '../utils/helpers/jwt.helper';


@Service()
export class UserController {
    constructor(
        private userService: UserService = Container.get(UserService)
    ) { }

    public signUp = tryCatch(
        async (req: Request, res: Response, next: NextFunction) => {
            const { firstName, lastName, email, password } = req.body;

            await this.userService.createUser({
                firstName,
                lastName,
                email,
                password
            });

            return successResponse(
                res,
                'User created successfully',
                {},
                StatusCodes.CREATED
            );

        }   
    );

    public login = tryCatch(
        async (req: Request, res: Response, next: NextFunction) => {
            const { email, password } = req.body;

            const user: any = await this.userService.login({ email, password });

            const userData = {
                id: user.id,
                email: user.email,
            };

            const userToken = generateJwtToken(userData, '7d');

            return successResponse(
                res,
                'User logged in successfully',
                { 
                    data: { user: removePasswordFromObject(user)},
                    token: userToken
                 },
                StatusCodes.OK
            );

        }   
    );
}


