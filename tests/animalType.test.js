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


})

// Tests post route for animalType
describe('POST /animalType', () => {
    test('posts a new animal type', async () => {
        const response = await request(app)
            .post('/animalType')
            .send({
                id_type: '47',
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

    test('returns error if animal type\'s id is null', async () => {
        const response = await request(app)
            .post('/animalType')
            .send({
                id_type: undefined
            });

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })

    test('posts an animal type already inserted', async () => {
        const response = await request(app)
            .post('/animalType')
            .send({
                type: 'Lion'
            });

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })

    test('returns error if id is already in use', async () => {
        const response = await request(app)
            .post('/animalType')
            .send({
                id_type: 1,
                type: 'Tiger'
            });

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body.detail).toEqual('Key (id_type)=(1) already exists.');
    })

    test('returns error if id is not a number', async () => {
        const response = await request(app)
            .post('/animalType')
            .send({
                id_type: 'a',
                type: 'Tiger'
            });

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })

    test('returns error if animal type has more than 200 caracters', async () => {
        const response = await request(app)
            .post('/animalType')
            .send({
                type: 'L'+'ion'.repeat(67)
            });

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })

    test('returns error if animal type doesnt follow regex constraint', async () => {
        const response = await request(app)
            .post('/animalType')
            .send({
                type: 'lion'
            });

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })
})

// Tests delete route for animalType
describe('DELETE /animalType/:id', () => {
    test('deletes an animal type', async () => {
        const response = await request(app)
            .delete('/animalType/47');

            expect(response.status).toBe(200);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body.rows).toHaveLength(1);

            expect(response.body.rows[0].type).toBe('Lion');
    })

    test('returns no content if animal type does not exist', async () => {
        const response = await request(app)
            .delete('/animalType/0');

            expect(response.status).toBe(204);
    })

    test('returns error if id is not a number', async () => {
        const response = await request(app)
            .delete('/animalType/a');

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })

})