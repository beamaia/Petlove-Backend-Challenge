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

// Tests get route for animal
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
            .get('/animal/151');

            expect(response.status).toBe(200);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body).toHaveLength(1);

            expect(response.body[0]).toHaveProperty('id_animal');
            expect(response.body[0]).toHaveProperty('id_person');
            expect(response.body[0]).toHaveProperty('id_type');
            expect(response.body[0]).toHaveProperty('name');
            expect(response.body[0]).toHaveProperty('date_birth');
            expect(response.body[0].id_type).toBe(12);
            expect(response.body[0].name).toBe('Fetch');
            expect(response.body[0].id_person).toBe('12345678900');
            expect(response.body[0].date_birth).toBe('2019-03-12T03:00:00.000Z');
    })

    test('returns error if animal does not exist', async () => {
        const response = await request(app)
            .get('/animal/0');

            expect(response.status).toBe(404);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body).toEqual('There is no animal with id as 0');
    })

    test('returns error if id is not a number', async () => {
        const response = await request(app)
            .get('/animal/a');

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body).toEqual('Invalid Id');
    })
})

// Tests to get a specific pet's schedule history
describe('GET /animal/:id/scheduleHistory', () => {
    test('returns the scheduled history of a specific pet', async () => {
        const response = await request(app)
            .get('/animal/151/scheduleHistory');
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.header['content-type']).toBe('application/json; charset=utf-8');

        // Checks if each element has property schedule #1
        expect(response.body[0]).toHaveProperty('id_schedule');
        expect(response.body[0]).toHaveProperty('id_animal');
        expect(response.body[0]).toHaveProperty('id_person');
        expect(response.body[0]).toHaveProperty('id_service');
        expect(response.body[0]).toHaveProperty('date_service');

        // Checks values of the first element
        expect(response.body[0].id_schedule).toBe(201);
        expect(response.body[0].id_animal).toBe(151);
        expect(response.body[0].id_person).toBe('12345678900');
        expect(response.body[0].id_service).toBe(3);
        expect(response.body[0].date_service).toBe('2023-04-15T16:00:00.000Z');

        // Checks if person is indeed the pet's owner
        const response_owner = await request(app)
            .get('/animal/151');

        expect(response_owner.status).toBe(200);
        expect(response_owner.body[0].id_person).toBe('12345678900');    
    })

    test('returns error if animal\'s id is not a number', async () => {
        const response = await request(app)
            .get('/animal/a/scheduleHistory');

            expect(response.status).toBe(400);
            expect(response.body).toEqual('Invalid Id');
    })

    test('returns empty if animal\'s id doesnt exist', async () => {
        const response = await request(app)
            .get('/animal/0/scheduleHistory');

            expect(response.status).toBe(404);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body).toEqual('There is no animal with id as 0');
    })

    test('returns empty if pet doesnt have anything scheduled', async () => {
        const response = await request(app)
            .get('/animal/19/scheduleHistory');

            expect(response.status).toBe(200);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body).toEqual([]);
    })
})

// Tests to get a specific pet's future schedule
describe('GET /animal/:id/schedule', () => {
    test('returns future schedules of a specific pet', async () => {
        const response = await request(app)
            .get('/animal/151/schedule');
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.header['content-type']).toBe('application/json; charset=utf-8');

        // Checks if each element has property schedule #1
        expect(response.body[0]).toHaveProperty('id_schedule');
        expect(response.body[0]).toHaveProperty('id_animal');
        expect(response.body[0]).toHaveProperty('id_person');
        expect(response.body[0]).toHaveProperty('id_service');
        expect(response.body[0]).toHaveProperty('date_service');

        // Checks values of the first element
        expect(response.body[0].id_schedule).toBe(201);
        expect(response.body[0].id_animal).toBe(151);
        expect(response.body[0].id_person).toBe('12345678900');
        expect(response.body[0].id_service).toBe(3);
        expect(response.body[0].date_service).toBe('2023-04-15T16:00:00.000Z');

        // Checks if person is indeed the pet's owner
        const response_owner = await request(app)
            .get('/animal/151');

        expect(response_owner.status).toBe(200);
        expect(response_owner.body[0].id_person).toBe('12345678900');    
    })

    test('returns error if animal\'s id is not a number', async () => {
        const response = await request(app)
            .get('/animal/a/schedule');

            expect(response.status).toBe(400);
            expect(response.body).toEqual('Invalid Id');
    })

    test('returns empty if animal\'s id doesnt exist', async () => {
        const response = await request(app)
            .get('/animal/0/schedule');

            expect(response.status).toBe(404);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body).toEqual('There is no animal with id as 0');
    })

    test('returns empty if pet doesnt have anything scheduled', async () => {
        const response = await request(app)
            .get('/animal/19/schedule');

            expect(response.status).toBe(200);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body).toEqual([]);
    })
})

// Tests to post a pet
describe('POST /animal', () => {
    test('posts a new animal passing id', async () => {
        const response = await request(app)
            .post('/animal')
            .send({
                id_animal: 152,
                id_person: '93774863057',
                id_type: 23,
                name: 'Blueberry',
                date_birth: '2013-04-23'
            });
            
            expect(response.status).toBe(201);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })

    test('return error if id is null', async () => {
        const response = await request(app)
            .post('/animal')
            .send({
                id_animal: null,
                name: 'Ginger',
                id_type: 22,
                id_person: '28138552030'
            });

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })

    test('returns error if owner\'s cpf is not passed', async () => {
        const response = await request(app)
            .post('/animal')
            .send({
                id_type: 22,
                name: 'Ginger',
            });

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })

    test('returns error if owner\'s cpf is not in the db', async () => {
        const response = await request(app)
            .post('/animal')
            .send({
                id_person: '93774863050',
                id_type: 22,
                name: 'Ginger',
                date_birth: '2019-08-03'
            });

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');

            expect(response.body.detail).toEqual('Key (id_person)=(93774863050) is not present in table \"person\".');
    })

    test('returns error if name of animal is not passed', async () => {
        const response = await request(app)
            .post('/animal')
            .send({
                id_type: 22,
                id_person: '28138552030'
            });

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })    

    test('returns error if id type of animal is not passed', async () => {
        const response = await request(app)
            .post('/animal')
            .send({
                name: 'Ginger',
                id_person: '28138552030'
            });

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })

    test('returns error if animal is empty', async () => {
        const response = await request(app)
            .post('/animal')
            .send({});

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })

    test('returns error if id was already inserted', async () => {
        const response = await request(app)
            .post('/animal')
            .send({
                id_animal: 3,
                id_type: 22,
                name: 'Ginger',
                id_person: '28138552030'
            });

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })

    test('returns error if id is not a number', async () => {
        const response = await request(app)
            .post('/animal')
            .send({
                id_animal: 'a',
                id_type: 22,
                name: 'Ginger',
                id_person: '28138552030'
            });

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body).toEqual("Invalid Id")

    })

    test('returns error if date_birth doesnt have YYYY-MM-DD format', async () => {
        const response = await request(app)
            .post('/animal')
            .send({
                id_type: 22,
                name: 'Ginger',
                id_person: '28138552030',
                date_birth:"2000/01/20"
            });

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body).toEqual("Invalid date format")

    })
})

// Tests patch route for animal
describe('PATCH /animal/:id', () => {
    test('updates an animal', async () => {
        const response = await request(app)
            .patch('/animal/152')
            .send({
                name:"blueberry"
            });

            expect(response.status).toBe(200);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body).toHaveLength(1);

            expect(response.body[0]).toHaveProperty('name');
            expect(response.body[0].name).toBe('blueberry');
    })

    test('return error if tries to change animal id', async () => {
        const response = await request(app)
            .patch('/animal/152')
            .send({
                id_animal: 156
            });

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body).toEqual("Cannot alter id");
    })    

    test('return error if date birth doesnt have YYYY-MM-DD format', async () => {
        const response = await request(app)
            .patch('/animal/152')
            .send({
                date_birth: "2000/01/20"
            });

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body).toEqual("Invalid date format");
    })

    test('returns error if animal is empty', async () => {
        const response = await request(app)
            .patch('/animal/152')
            .send({});

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })

    test('returns error if tries to change owner cpf', async () => {
        const response = await request(app)
            .patch('/animal/152')
            .send({
                id_person: "12345678901"
            });

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body).toEqual("Owner cannot be changed");
    })

    test('returns error if tries to change an animal that doesnt exist', async () => {
        const response = await request(app)
            .patch('/animal/0')
            .send({
                name: "Ginger"
            });

            expect(response.status).toBe(404);
            expect(response.body).toEqual("There is no animal with id as 0");

    })

    test('returns error if animal id is not numeric', async () => {
        const response = await request(app)
            .patch('/animal/a')
            .send({
                name: 'Ginger'
            });

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body).toEqual("Invalid Id");
    })
})


// Tests delete route for animal
describe('DELETE /animal', () => {
    test('deletes a specific animal', async () => {
        const response = await request(app)
            .delete('/animal/152');
        
        expect(response.status).toBe(200);
        expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        expect(response.body.rows[0]).toHaveProperty('id_animal');
        expect(response.body.rows[0]).toHaveProperty('name');
        expect(response.body.rows[0]).toHaveProperty('date_birth');
        expect(response.body.rows[0]).toHaveProperty('id_person');
        expect(response.body.rows[0]).toHaveProperty('id_type');

        expect(response.body.rows[0].id_person).toBe('93774863057');
        expect(response.body.rows[0].name).toBe('blueberry');
    })

    test('returns error if animal does not exist', async () => {
        const response = await request(app)
            .delete('/animal/0');

            expect(response.status).toBe(404);
            expect(response.body).toEqual("There is no animal with id as 0");
    })

    test('returns error if id is not a number', async () => {
        const response = await request(app)
            .delete('/animal/a');

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body).toEqual("Invalid Id");

    })
})