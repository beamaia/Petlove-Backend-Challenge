const request = require('supertest');
const app = require('../src/config/customExpress');
const aux = require('../src/utils/utils');
const db = require('../src/database/db')

afterAll(() => db.end());


// Tests get route for animalType
describe('GET /animalType', () => {
    test('returns all animals types', async () => {
        const response = await request(app)
            .get('/animalType');
        

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(46);
        expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })
});    


// Tests get by id route for animalType
describe('GET /animalType/:id', () => {
    test('returns an especific animal type', async () => {
        const response = await request(app)
            .get('/animalType/23');

            expect(response.status).toBe(200);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body).toHaveLength(1);

            expect(response.body[0]).toHaveProperty('id_type');
            expect(response.body[0]).toHaveProperty('type');
            expect(response.body[0].type).toBe('Dog');
    })

    test('returns empty if animal type does not exist', async () => {
        const response = await request(app)
            .get('/animalType/0');

            expect(response.status).toBe(200);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body).toEqual([]);
    })

    test('returns error if id is not a number', async () => {
        const response = await request(app)
            .get('/animalType/a');

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body).toEqual('Invalid Id');
    })


});    

describe('POST /animalType', () => {
    test('posts a new animal type', async () => {
        const response = await request(app)
            .post('/animalType')
            .send({
                type: 'Lion'
            });

            expect(response.status).toBe(201);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');

            expect(response.body.rows[0]).toHaveProperty('id_type');
            expect(response.body.rows[0]).toHaveProperty('type');
            expect(response.body.rows[0].type).toBe('Lion');
    })

    test('returns error if animal type is empty', async () => {
        const response = await request(app)
            .post('/animalType')
            .send({});

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })

    test('returns error if animal type is null', async () => {
        const response = await request(app)
            .post('/animalType')
            .send({
                type: undefined
            });

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })

    // teste animal type repetido
    // teste id repetido
    // teste id não numérico
    // teste animal type tamanho máximo
})
