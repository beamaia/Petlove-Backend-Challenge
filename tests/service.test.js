const request = require('supertest');
const app = require('../src/config/customExpress');
const aux = require('../src/utils/utils');
const db = require('../src/database/db')

afterAll(() => db.end());


// Tests get route for service
describe('GET /service', () => {
    test('returns all services', async () => {
        const response = await request(app)
            .get('/service');
        

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(8);
        expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })
});    


// Tests get by id route for service
describe('GET /service/:id', () => {
    test('returns an especific service', async () => {
        const response = await request(app)
            .get('/service/2');

            expect(response.status).toBe(200);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body).toHaveLength(1);

            expect(response.body[0]).toHaveProperty('id_service');
            expect(response.body[0]).toHaveProperty('service_type');
            expect(response.body[0]).toHaveProperty('price');
            expect(response.body[0].service_type).toBe('Grooming');
            expect(response.body[0].price).toBe(65);
    })

    test('returns empty if animal type does not exist', async () => {
        const response = await request(app)
            .get('/service/0');

            expect(response.status).toBe(200);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body).toEqual([]);
    })

    test('returns error if id is not a number', async () => {
        const response = await request(app)
            .get('/service/a');

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body).toEqual('Invalid Id');
    })


})

// Tests post route for service
describe('POST /service', () => {
    test('posts a new service passing id', async () => {
        const response = await request(app)
            .post('/service')
            .send({
                id_service: '9',
                service_type: 'Urine exam',
                price: 110
            });

            expect(response.status).toBe(201);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');

            expect(response.body.rows[0]).toHaveProperty('id_service');
            expect(response.body.rows[0]).toHaveProperty('service_type');
            expect(response.body.rows[0]).toHaveProperty('price');
    })

    test('posts a new service without passing id', async () => {
        const response = await request(app)
            .post('/service')
            .send({
                service_type: 'Tomography',
                price: 350
            });

            expect(response.status).toBe(201);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');

            expect(response.body.rows[0]).toHaveProperty('id_service');
            expect(response.body.rows[0]).toHaveProperty('service_type');
            expect(response.body.rows[0]).toHaveProperty('price');

        // deletes the created service so it wont conflit to tests
        const response_del = await request(app)
            .delete(`/service/${response.body.rows[0].id_service}`)
    })

    test('returns error if service is empty', async () => {
        const response = await request(app)
            .post('/service')
            .send({});

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })

    test('returns error if service\'s price is null', async () => {
        const response = await request(app)
            .post('/service')
            .send({
                service_type: 'Biopsy',
                price: undefined
            });

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })

    test('returns error if service\'s id is null', async () => {
        const response = await request(app)
            .post('/service')
            .send({
                id_service: null,
                service_type: 'Biopsy',
                price: 90
            });

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })

    test('returns error if a service was already inserted', async () => {
        const response = await request(app)
            .post('/service')
            .send({
                service_type: 'Grooming',
                price: 80
            });

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })

    test('returns error if id is already in use', async () => {
        const response = await request(app)
            .post('/service')
            .send({
                id_service: 1,
                service_type: 'Biopsy',
                price: 90
            });

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body.detail).toEqual('Key (id_service)=(1) already exists.');
    })

    test('returns error if id is not a number', async () => {
        const response = await request(app)
            .post('/service')
            .send({
                id_service: 'a',
                service_type: 'Biopsy',
                price: 90
            });

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })

    test('returns error if service has more than 50 caracters', async () => {
        const response = await request(app)
            .post('/service')
            .send({
                service_type: 'B'+'iopsy'.repeat(10)
            });

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })

    test('returns error if service doesnt follow regex constraint', async () => {
        const response = await request(app)
            .post('/service')
            .send({
                service_type: 'biopsy',
                price: 90
            });

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        })
})

// // Tests patch route for service
// describe('PATCH /service/:id', () => {
//     test('updates an animal type', async () => {
//         const response = await request(app)
//             .patch('/service/47')
//             .send({
//                 type: 'Tiger'
//             });

//             expect(response.status).toBe(200);
//             expect(response.header['content-type']).toBe('application/json; charset=utf-8');
//             expect(response.body).toHaveLength(1);

//             expect(response.body[0]).toHaveProperty('id_service');
//             expect(response.body[0]).toHaveProperty('type');
//             expect(response.body[0].type).toBe('Tiger');
//     })

//     test('returns error if animal type is empty', async () => {
//         const response = await request(app)
//             .patch('/service/47')
//             .send({});

//             expect(response.status).toBe(400);
//             expect(response.header['content-type']).toBe('application/json; charset=utf-8');
//     })

//     test('returns error if tries change id', async () => {
//         const response = await request(app)
//             .patch('/service/47')
//             .send({
//                 id_service: 90
//             });

//             expect(response.status).toBe(400);
//             expect(response.header['content-type']).toBe('application/json; charset=utf-8');

//             expect(response.body).toEqual('Cannot alter id');
//     })

//     test('returns error if animal type doesnt follows constraint', async () => {
//         const response = await request(app)
//             .patch('/service/47')
//             .send({
//                 type: 'lion'
//             });

//             expect(response.status).toBe(400);
//             expect(response.header['content-type']).toBe('application/json; charset=utf-8');
//     })

//     test('returns no content if animal type\'s id doesnt exist', async () => {
//         const response = await request(app)
//             .patch('/service/0')
//             .send({
//                 type: 'Tiger'
//             });

//             expect(response.status).toBe(204);
//     })

//     test('returns error if animal type id is not numeric', async () => {
//         const response = await request(app)
//             .patch('/service/a')
//             .send({
//                 type: 'Panther'
//             });

//             expect(response.status).toBe(400);
//             expect(response.header['content-type']).toBe('application/json; charset=utf-8');
//     })
// })
    
// // Tests delete route for service
// describe('DELETE /service/:id', () => {
//     test('deletes an animal type', async () => {
//         const response = await request(app)
//             .delete('/service/47');

//             expect(response.status).toBe(200);
//             expect(response.header['content-type']).toBe('application/json; charset=utf-8');
//             expect(response.body.rows).toHaveLength(1);

//             expect(response.body.rows[0].type).toBe('Tiger');
//     })

//     test('returns no content if animal type does not exist', async () => {
//         const response = await request(app)
//             .delete('/service/0');

//             expect(response.status).toBe(204);
//     })

//     test('returns error if id is not a number', async () => {
//         const response = await request(app)
//             .delete('/service/a');

//             expect(response.status).toBe(400);
//             expect(response.header['content-type']).toBe('application/json; charset=utf-8');
//     })

// })
