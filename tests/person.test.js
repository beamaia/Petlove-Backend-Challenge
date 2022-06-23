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
});    

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
            expect(response.body[0].date_birth).toBe('1993-07-02T03:00:00.000Z');
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

// // Returns all persons from database
// router.get('/person', Person.getAll)

// // Returns a specific person from database
// router.get('/person/:id', Person.get)

// // Returns a specific person's pets from database
// router.get('/person/:id/animal', Person.getPets)

// // Returns a specific person's pets schedule from database
// router.get('/person/:id/schedule', function (req, res) {
//     Person.getSchedule(req, res, 'future')
// })

// // Returns a specific person's pets schedule history from database
// router.get('/person/:id/scheduleHistory', function (req, res) {
//     Person.getSchedule(req, res, 'history')
// })

