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
        expect(response.body).toHaveLength(3);

        // Checks if each element has property pet #1
        expect(response.body[0]).toHaveProperty('id_animal');
        expect(response.body[0]).toHaveProperty('id_person');
        expect(response.body[0]).toHaveProperty('id_type');
        expect(response.body[0]).toHaveProperty('name');
        expect(response.body[0]).toHaveProperty('date_birth');

        // Checks if each element has property pet #2
        expect(response.body[0]).toHaveProperty('id_animal');
        expect(response.body[0]).toHaveProperty('id_person');
        expect(response.body[0]).toHaveProperty('id_type');
        expect(response.body[0]).toHaveProperty('name');
        expect(response.body[0]).toHaveProperty('date_birth');

        // Checks if each element has property pet #3
        expect(response.body[0]).toHaveProperty('id_animal');
        expect(response.body[0]).toHaveProperty('id_person');
        expect(response.body[0]).toHaveProperty('id_type');
        expect(response.body[0]).toHaveProperty('name');
        expect(response.body[0]).toHaveProperty('date_birth');

        // Checks values
        expect(response.body[0].id_animal).toBe(3);
        expect(response.body[0].id_person).toBe('91165531253');
        expect(response.body[0].id_type).toBe(31);
        expect(response.body[0].name).toBe('Elisa');
        expect(response.body[0].date_birth).toContain('2019-01-17');

        expect(response.body[1].id_animal).toBe(41);
        expect(response.body[1].id_person).toBe('91165531253');
        expect(response.body[1].id_type).toBe(14);
        expect(response.body[1].name).toBe('Calebe');
        expect(response.body[1].date_birth).toContain('2015-07-19');

        expect(response.body[2].id_animal).toBe(96);
        expect(response.body[2].id_person).toBe('91165531253');
        expect(response.body[2].id_type).toBe(19);
        expect(response.body[2].name).toBe('Letícia');
        expect(response.body[2].date_birth).toContain('2012-10-13');

        expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        
    })

    
})

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

