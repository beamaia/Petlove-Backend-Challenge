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
            .get('/animal/18/scheduleHistory');
        
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
        expect(response.body[0].id_schedule).toBe(106);
        expect(response.body[0].id_animal).toBe(18);
        expect(response.body[0].id_person).toBe('40313557786');
        expect(response.body[0].id_service).toBe(2);
        expect(response.body[0].date_service).toBe('2021-10-02T19:30:00.000Z');

        // Checks if person is indeed the pet's owner
        const response_owner = await request(app)
            .get('/animal/18');

        expect(response_owner.status).toBe(200);
        expect(response_owner.body[0].id_person).toBe('40313557786');    
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
            .get('/animal/15/schedule');
        
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
        expect(response.body[0].id_schedule).toBe(187);
        expect(response.body[0].id_animal).toBe(15);
        expect(response.body[0].id_person).toBe('98515543667');
        expect(response.body[0].id_service).toBe(7);
        expect(response.body[0].date_service).toBe('2023-03-08T20:00:00.000Z');

        // Checks if person is indeed the pet's owner
        const response_owner = await request(app)
            .get('/animal/15');

        expect(response_owner.status).toBe(200);
        expect(response_owner.body[0].id_person).toBe('98515543667');    
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