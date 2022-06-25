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
            expect(response.body[0].id_type).toBe(39);
            expect(response.body[0].name).toBe('Fetch');
            expect(response.body[0].id_person).toBe('12345678900');
            expect(response.body[0].date_birth).toBe('2019-03-12');
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
        expect(response.body[0].date_service).toBe('2023-04-15 13:00');

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
        expect(response.body[0].date_service).toBe('2023-04-15 13:00');

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
                id_person: '11111111111',
                full_name: 'Mr.Smiley',
                date_birth: '1999-01-31'
            });
            
            expect(response.status).toBe(201);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');

            expect(response.body.rows[0]).toHaveProperty('cpf');
            expect(response.body.rows[0]).toHaveProperty('full_name');
    })

    test('posts a new person passing empty id', async () => {
        const response = await request(app)
            .post('/person')
            .send({
                cpf: '',
                full_name: 'Mr.Smiley',
                date_birth: '1999-01-31'
            });

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body).toEqaul("Invalid CPF")
    })

    test('returns error at attempt to post a new person without passing cpf', async () => {
        const response = await request(app)
            .post('/person')
            .send({
                cpf: '11111111111',
                date_birth: '1999-01-31'
            });

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })
    

    test('returns error at attempt to post a new person without passing full_name', async () => {
        const response = await request(app)
            .post('/person')
            .send({
                full_name: 'Mr.Smiley',
                date_birth: '1999-01-31'
            });

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })

    test('returns error if person is empty', async () => {
        const response = await request(app)
            .post('/person')
            .send({});

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })

    test('returns error if a person was already inserted', async () => {
        const response = await request(app)
            .post('/person')
            .send({
                cpf: '11111111111',
                full_name: 'Mr.Smiley',
            });

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })


    test('returns error if cpf is not a number', async () => {
        const response = await request(app)
            .post('/person')
            .send({
                cpf: '1111111111a',
                full_name: 'Mr.Smiley',
            });

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body).toEqual("Invalid CPF")

    })

    test('returns error if cpf doesnt have 11 digits', async () => {
        const response = await request(app)
            .post('/person')
            .send({
                cpf: '1111111111',
                full_name: 'Mr.Smiley',
            });

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body).toEqual("Invalid CPF")

    })

    test('returns error if date_birth doesnt have YYYY-MM-DD format', async () => {
        const response = await request(app)
            .post('/person')
            .send({
                cpf: '11111111113',
                full_name: 'Mr.Smiley',
                date_birth:"2000/01/20"
            });

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body).toEqual("Invalid date format")

    })

    test('returns error if person is younger than 18', async () => {
        const response = await request(app)
            .post('/person')
            .send({
                cpf: '11111111112',
                full_name: 'Mr.Smiley',
                date_birth:"2008-01-20"
            });

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body).toEqual("Invalid birth date")

    })

    test('returns error if person is older than 140', async () => {
        const response = await request(app)
            .post('/person')
            .send({
                cpf: '11111111112',
                full_name: 'Mr.Smiley',
                date_birth:"1808-01-20"
            });

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body).toEqual("Invalid birth date")

    })

    test('returns error if postal code has more than 9 characters', async () => {
        const response = await request(app)
            .post('/person')
            .send({
                cpf: '11111111112',
                full_name: 'Mr.Smiley',
                postal_code: "320935803989"
            });
            
            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body).toEqual("Invalid postal code")

    })
})