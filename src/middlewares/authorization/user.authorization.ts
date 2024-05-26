import { NextFunction, Request, Response } from 'express';
import { verifyJwtToken } from '../../utils/helpers/jwt.helper';
import AppError from '../../utils/lib/appError';
import { StatusCodes } from 'http-status-codes';
import tryCatch from '../../utils/helpers/tryCatch.helper';
import { Container, Service } from 'typedi';
import { UserRepository } from '../../repositories/user.repository';

@Service()
export class UserAuthorization {

    constructor(
        private userService: UserRepository = Container.get(UserRepository)
    ) {}

    public userAuth = tryCatch(
        async (req: Request, res: Response, next: NextFunction) => {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer')) {
                throw new AppError(
                    'Authorization token is missing',
                    StatusCodes.FORBIDDEN
                );
            }
            const token = authHeader.split(' ')[1];
            if (!token) {
                throw new AppError(
                    'Authorization token is missing',
                    StatusCodes.FORBIDDEN
                );
            }

            const decodedToken = verifyJwtToken(token);
            if (!decodedToken) {
                throw new AppError(
                    'Your login session has expired. Please login again',
                    StatusCodes.FORBIDDEN
                );
            }

            const user = await this.userService.findById(decodedToken.id);

            if (!user) {
                throw new AppError('User not found', StatusCodes.NOT_FOUND);
            }

            req.app.set('user', user);
            next();
        }
    );
}
