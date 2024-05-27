import { describe, it, expect, jest, test, afterAll } from '@jest/globals';
import { faker } from '@faker-js/faker';
import app from '../app';
import request from 'supertest';
import assert from 'assert';

describe('GET /v1/user', () => {
    test('should create new user account', async () => {
        return request(app)
            .post('/api/v1/user/signup')
            .set('Content-Type', 'application/json')
            .send({
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
            })
            .expect(201)
            .expect(function (res) {
                assert(res.body.hasOwnProperty('success'));
                assert(res.body.hasOwnProperty('message'));
            });
    });

    test('should login user', async () => {
        return request(app)
            .post('/api/v1/user/login')
            .set('Content-Type', 'application/json')
            .send({
                email: faker.internet.email(),
                password: faker.internet.password(),
            })
            .expect(200)
            .expect(function (res) {
                assert(res.body.hasOwnProperty('success'));
                assert(res.body.hasOwnProperty('message'));
                assert(res.body.hasOwnProperty('data'));
                assert(res.body.data.hasOwnProperty('user'));
                assert(res.body.data.hasOwnProperty('token'));
            });
    }
    );
});

afterAll(() => {
    // TODO: close db connection
});

process.once('SIGTERM', () => {
    // TODO: close db connection
});
