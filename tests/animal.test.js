const request = require('supertest');
const app = require('../src/config/customExpress');
const aux = require('../src/utils/utils');
const db = require('../src/database/db')

afterAll(() => db.end());

expect.extend({
    cpfChecker(received) {
        const pass = received.length == 11 && aux.getCountOfDigits(received) == 11;
        console.log(received)
        if (pass) {
            return {
                message: () =>
                    `expected cpf ${received} not to have 11 digits`,
                pass: true,
            };
        } else {
            return {
                message: () =>
                    `expected cpf ${received} to have 11 digits`,
                pass: false,
            };
        }
    },
});

describe('GET /animal', () => {
    test('returns all animals', async () => {
        const response = await request(app)
            .get('/animal');
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(151);

        })
});    