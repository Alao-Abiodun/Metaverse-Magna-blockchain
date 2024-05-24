import { NextFunction, Request, Response } from 'express';
import { successResponse } from '../utils/lib/response';
import { StatusCodes } from 'http-status-codes';
import tryCatch from '../utils/helpers/tryCatch.helper';
import { IUsers } from '../types/user.types';
import * as userRepository from '../repositories/user.repository';
import { hashPassword, comparePassword } from "../utils/helpers/bcrypt.helper";
import AppError from '../utils/lib/appError';
import { removePasswordFromObject } from '../utils/helpers/password.helper';
import  { Container, Inject, Service } from 'typedi';
import { UserService } from '../services/user.service';
import { IUser } from '../entities/User';


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
                password: await hashPassword(password)
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

            return successResponse(
                res,
                'User logged in successfully',
                { data: { user: removePasswordFromObject(user)}},
                StatusCodes.OK
            );

        }   
    );
}


