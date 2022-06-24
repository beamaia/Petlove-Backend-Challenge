const request = require('supertest')
const app = require('../src/config/customExpress')
const aux = require('../src/utils/utils')
const db = require('../src/database/db')

afterAll(() => db.end());


// Tests get route for person
describe('GET /person', () => {
    test('returns every person', async () => {
        const response = await request(app)
            .get('/person');
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(100);
        expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })
})

// Tests get by id route for person
describe('GET /person/:id', () => {
    test('returns a specific person', async () => {
        const response = await request(app)
            .get('/person/25631219101');

            expect(response.status).toBe(200);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body).toHaveLength(1);
            expect(response.body[0]).toHaveProperty('cpf');
            expect(response.body[0]).toHaveProperty('full_name');
            expect(response.body[0]).toHaveProperty('date_birth');
            expect(response.body[0]).toHaveProperty('number');
            expect(response.body[0]).toHaveProperty('road');
            expect(response.body[0]).toHaveProperty('city');
            expect(response.body[0]).toHaveProperty('postal_code');
            expect(response.body[0]).toHaveProperty('phone');
            expect(response.body[0].cpf).toBe('25631219101');
            expect(response.body[0].full_name).toBe('Antônio Freitas');
            expect(response.body[0].date_birth).toContain('1993-07-02');
            expect(response.body[0].number).toBe(990);
            expect(response.body[0].road).toBe('Alameda Favela Dias');
            expect(response.body[0].city).toBe('Viana');
            expect(response.body[0].postal_code).toBe('32181960');
            expect(response.body[0].phone).toBe('84 3794 0265');
    })

    test('returns empty if person does not exist', async () => {
        const response = await request(app)
            .get('/person/0');

            expect(response.status).toBe(204);
            expect(response.body).toEqual({});
    })

    test('returns error if cpf is not a number', async () => {
        const response = await request(app)
            .get('/person/a');
            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body).toEqual('Invalid Id');
    })


})


// Tests get route to return a specific person's pets from database
describe('GET /person/:id/animal', () => {
    test('returns persons with 91165531253 pets', async () => {
        const response = await request(app)
            .get('/person/91165531253/animal');

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);

        // Checks if each element has property pet #1
        expect(response.body[0]).toHaveProperty('id_animal');
        expect(response.body[0]).toHaveProperty('id_person');
        expect(response.body[0]).toHaveProperty('id_type');
        expect(response.body[0]).toHaveProperty('name');
        expect(response.body[0]).toHaveProperty('date_birth');

        // Checks values
        expect(response.body[0].id_animal).toBe(78);
        expect(response.body[0].id_person).toBe('91165531253');
        expect(response.body[0].id_type).toBe(4);
        expect(response.body[0].name).toBe('Enzo');
        expect(response.body[0].date_birth).toContain('2019-03-10');

        expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        
    })

    // TODO: post person beforehand
    // test('returns empty if person does not exist', async () => {
    //     const response = await request(app)
    //         .get('/person/11111111111');

    //         expect(response.status).toBe(204);
    //         expect(response.body).toEqual({});
    //         expect(response.body).toEqual("The person with cpf as ${id} has no pet")
    // })


    test('returns error if cpf is not a number', async () => {
        const response = await request(app)
            .get('/person/a/animal');
            expect(response.status).toBe(400);
            expect(response.body).toEqual('Invalid Id');
    })

    test('returns message if cpf doesnt exist', async () => {
        const response = await request(app)
            .get('/person/22222222222/animal');

            expect(response.status).toBe(204);
            expect(response.body).toEqual({});
    })

})


// Tests to get a specific person's pets schedule from database
describe('GET /person/:id/scheduleHistory', () => {
    test('returns persons 76612908200 scheduled history', async () => {
        const response = await request(app)
            .get('/person/76612908200/scheduleHistory');
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);

        // Checks if each element has property schedule #1
        expect(response.body[0]).toHaveProperty('id_schedule');
        expect(response.body[0]).toHaveProperty('id_animal');
        expect(response.body[0]).toHaveProperty('id_person');
        expect(response.body[0]).toHaveProperty('id_service');
        expect(response.body[0]).toHaveProperty('date_service');

        expect(response.body[0].id_schedule).toBe(130);
        expect(response.body[0].id_animal).toBe(146);
        expect(response.body[0].id_person).toBe('76612908200');
        expect(response.body[0].id_service).toBe(8);
        expect(response.body[0].date_service).toBe('2021-09-01T15:30:00.000Z');


        expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })

    test('returns error if cpf is not a number', async () => {
        const response = await request(app)
            .get('/person/a/scheduleHistory');
            expect(response.status).toBe(400);
            expect(response.body).toEqual('Invalid Id');
    })

    test('returns message if cpf doesnt exist', async () => {
        const response = await request(app)
            .get('/person/22222222222/scheduleHistory');

            expect(response.status).toBe(204);
            expect(response.body).toEqual({});
    })

    // TODO must post animal before
    // test('returns message if cpf doesnt have anything scheduled', async () => {
    //     const response = await request(app)
    //         .get('/person/22222222222/scheduleHistory');

    //         expect(response.status).toBe(204);
    //         expect(response.body).toEqual({});
    // })
})

describe('GET /person/:id/schedule', () => {
    test('returns person 81463743911 current schedule', async () => {
        const response = await request(app)
            .get('/person/81463743911/schedule');
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(3);

        // Checks if each element has property schedule #1
        expect(response.body[0]).toHaveProperty('id_schedule');
        expect(response.body[0]).toHaveProperty('id_animal');
        expect(response.body[0]).toHaveProperty('id_person');
        expect(response.body[0]).toHaveProperty('id_service');
        expect(response.body[0]).toHaveProperty('date_service');

        expect(response.body[0].id_schedule).toBe(183);
        expect(response.body[0].id_animal).toBe(11);
        expect(response.body[0].id_person).toBe('81463743911');
        expect(response.body[0].id_service).toBe(4);
        expect(response.body[0].date_service).toBe('2023-03-03T18:00:00.000Z');


        expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })
})

// // Returns a specific person's pets from database
// router.get('/person/:id/animal', Person.getPets)

// // Returns a specific person's pets schedule history from database
// router.get('/person/:id/scheduleHistory', function (req, res) {
//     Person.getSchedule(req, res, 'history')
// })

