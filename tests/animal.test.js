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
        expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })
});   

// Tests get by id route for animal
describe('GET /animal/:id', () => {
    test('returns an especific animal', async () => {
        const response = await request(app)
            .get('/animal/14');

            expect(response.status).toBe(200);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body).toHaveLength(1);

            expect(response.body[0]).toHaveProperty('id_animal');
            expect(response.body[0]).toHaveProperty('id_person');
            expect(response.body[0]).toHaveProperty('id_type');
            expect(response.body[0]).toHaveProperty('name');
            expect(response.body[0]).toHaveProperty('date_birth');
            expect(response.body[0].id_type).toBe(39);
            expect(response.body[0].name).toBe('Sophie');
            expect(response.body[0].id_person).toBe('34169696708');
    })

    test('returns empty if animal does not exist', async () => {
        const response = await request(app)
            .get('/animal/0');

            expect(response.status).toBe(200);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body).toEqual([]);
    })

    test('returns error if id is not a number', async () => {
        const response = await request(app)
            .get('/animal/a');

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body).toEqual('Invalid Id');
    })
})