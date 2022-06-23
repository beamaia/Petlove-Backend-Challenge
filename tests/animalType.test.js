const request = require('supertest');
const app = require('../src/config/customExpress');
const aux = require('../src/utils/utils');
const db = require('../src/database/db')

afterAll(async () => await db.end());


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
    test('posts a new animal type passing id', async () => {
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

    test('posts a new animal type without passing id', async () => {
        const response = await request(app)
            .post('/animalType')
            .send({
                type: 'Capybara'
            });

            expect(response.status).toBe(201);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');

            expect(response.body.rows[0]).toHaveProperty('id_type');
            expect(response.body.rows[0]).toHaveProperty('type');

        // deletes the created service so it wont conflit to tests
        const response_del = await request(app)
            .delete(`/animalType/${response.body.rows[0].id_type}`)
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
                id_type: null,
                type: 'Panther'
            });

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })

    test('returns error if an animal type already inserted', async () => {
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

// Tests patch route for animalType
describe('PATCH /animalType/:id', () => {
    test('updates an animal type', async () => {
        const response = await request(app)
            .patch('/animalType/47')
            .send({
                type: 'Tiger'
            });

            expect(response.status).toBe(200);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body).toHaveLength(1);

            expect(response.body[0]).toHaveProperty('id_type');
            expect(response.body[0]).toHaveProperty('type');
            expect(response.body[0].type).toBe('Tiger');
    })

    test('returns error if animal type is empty', async () => {
        const response = await request(app)
            .patch('/animalType/47')
            .send({});

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })

    test('returns error if tries change id', async () => {
        const response = await request(app)
            .patch('/animalType/47')
            .send({
                id_type: 90
            });

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');

            expect(response.body).toEqual('Cannot alter id');
    })

    test('returns error if animal type doesnt follows constraint', async () => {
        const response = await request(app)
            .patch('/animalType/47')
            .send({
                type: 'lion'
            });

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })

    test('returns no content if animal type\'s id doesnt exist', async () => {
        const response = await request(app)
            .patch('/animalType/0')
            .send({
                type: 'Tiger'
            });

            expect(response.status).toBe(204);
    })

    test('returns error if animal type id is not numeric', async () => {
        const response = await request(app)
            .patch('/animalType/a')
            .send({
                type: 'Panther'
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

            expect(response.body.rows[0].type).toBe('Tiger');
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
