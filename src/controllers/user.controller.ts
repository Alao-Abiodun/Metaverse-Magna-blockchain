import { NextFunction, Request, Response } from 'express';
import { successResponse } from '../utils/lib/response';
import { StatusCodes } from 'http-status-codes';
import tryCatch from '../utils/helpers/tryCatch.helper';
import { IUsers } from '../types/user.types';
import * as userRepository from '../repositories/user.repositories';
import { hashPassword, comparePassword } from "../utils/helpers/bcrypt.helper";
import AppError from '../utils/lib/appError';
import { removePasswordFromObject } from '../utils/helpers/password.helper';


/**
 * @description This function creates a new user
 * @param req The request object
 * @param res The response object
 * @param next The next function
 * @returns ISuccessResponse | IErrorResponse
 */
export const signUp = tryCatch(
    async (req: Request, res: Response, next: NextFunction) => {
        const { firstName, lastName, email, password } = req.body;

        const userExists = await userRepository.findByEmail(email);
        
        if (userExists) {
            throw new AppError('User already exists', StatusCodes.CONFLICT);
        }

        const hashedPassword = await hashPassword(password);
        
        const user = await userRepository.create({
            id: 0,
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        return successResponse(
            res,
            'User created successfully',
            {},
            StatusCodes.CREATED
        );

    }   
);

/**
 * @description This function logs in a user
 * @param req The request object
 * @param res The response object
 * @param next The next function
 * @returns ISuccessResponse | IErrorResponse
 */
export const login = tryCatch(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;

        const user = await userRepository.findByEmail(email);

        if (!user) {
            throw new AppError('Invalid credentials', StatusCodes.UNAUTHORIZED);
        }

        const passwordMatch = await comparePassword(password, user.password);

        if (!passwordMatch) {
            throw new AppError('Invalid credentials', StatusCodes.UNAUTHORIZED);
        }

        return successResponse(
            res,
            'User logged in successfully',
            { data: { user: removePasswordFromObject(user)}},
            StatusCodes.OK
        );

    }   
);
