const request = require('supertest')
const app = require('../src/config/customExpress')
const aux = require('../src/utils/utils')
const db = require('../src/database/db')

afterAll(async () => await db.end());

// Tests post route for service
describe('POST /person', () => {
    test('posts a new person passing id', async () => {
        const response = await request(app)
            .post('/person')
            .send({
                cpf: '11111111111',
                full_name: 'Mr.Smiley',
                date_birth: '1999-01-31'
            });
            
            expect(response.status).toBe(201);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');

            expect(response.body.rows[0]).toHaveProperty('cpf');
            expect(response.body.rows[0]).toHaveProperty('full_name');
    })

    test('returns error at attempt of posting a new person passing empty id', async () => {
        const response = await request(app)
            .post('/person')
            .send({
                cpf: '',
                full_name: 'Mr.Smiley',
                date_birth: '1999-01-31'
            });

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body).toEqual("Invalid CPF")
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

// Tests get by id route for person
describe('GET /person/:id', () => {
    test('returns a specific person', async () => {
        const response = await request(app)
            .get('/person/12345678900');

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
            expect(response.body[0].cpf).toBe('12345678900');
            expect(response.body[0].full_name).toBe('Testador José');
            expect(response.body[0].date_birth).toContain('2000-01-01');
            expect(response.body[0].number).toBe(1);
            expect(response.body[0].road).toBe('Rua Aprovacao');
            expect(response.body[0].city).toBe('Notapolis');
            expect(response.body[0].postal_code).toBe('10101-101');
            expect(response.body[0].phone).toBe('(27)99999-9999');
    })

    test('returns error if person does not exist', async () => {
        const response = await request(app)
            .get('/person/0');

            expect(response.status).toBe(404);
            expect(response.body).toEqual("There is no person with cpf as 0");

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
    test('returns persons with cpf 12345678900 pets', async () => {
        const response = await request(app)
            .get('/person/12345678900/animal');

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);

        // Checks if each element has property pet #1
        expect(response.body[0]).toHaveProperty('id_animal');
        expect(response.body[0]).toHaveProperty('id_person');
        expect(response.body[0]).toHaveProperty('id_type');
        expect(response.body[0]).toHaveProperty('name');
        expect(response.body[0]).toHaveProperty('date_birth');

        // Checks values
        expect(response.body[0].id_animal).toBe(151);
        expect(response.body[0].id_person).toBe('12345678900');
        expect(response.body[0].id_type).toBe(12);
        expect(response.body[0].name).toBe('Fetch');
        expect(response.body[0].date_birth).toContain('2019-03-12');

        expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        
    })

    test('returns error if cpf is not a number', async () => {
        const response = await request(app)
            .get('/person/a/animal');
            expect(response.status).toBe(400);
            expect(response.body).toEqual('Invalid Id');
    })

    test('returns error if person does not exist', async () => {
        const response = await request(app)
            .get('/person/22222222222/animal');

            expect(response.status).toBe(404);
            expect(response.body).toEqual("There is no person with cpf as 22222222222");
    })

    test('returns message if cpf doesnt have any pets', async () => {
        const response = await request(app)
            .get('/person/11111111111/animal');

            expect(response.status).toBe(200);
            expect(response.body).toEqual("The person with cpf as 11111111111 has no pet");
    })

})

// Tests to get a specific person's pets schedule from database
describe('GET /person/:id/scheduleHistory', () => {
    test('returns persons 12345678900 scheduled history', async () => {
        const response = await request(app)
            .get('/person/12345678900/scheduleHistory');
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);

        // Checks if each element has property schedule #1
        expect(response.body[0]).toHaveProperty('id_schedule');
        expect(response.body[0]).toHaveProperty('id_animal');
        expect(response.body[0]).toHaveProperty('id_person');
        expect(response.body[0]).toHaveProperty('id_service');
        expect(response.body[0]).toHaveProperty('date_service');

        expect(response.body[0].id_schedule).toBe(201);
        expect(response.body[0].id_animal).toBe(151);
        expect(response.body[0].id_person).toBe('12345678900');
        expect(response.body[0].id_service).toBe(3);
        expect(response.body[0].date_service).toBe('2023-04-15T16:00:00.000Z');

        expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })

    test('returns error if cpf is not a number', async () => {
        const response = await request(app)
            .get('/person/a/scheduleHistory');
            expect(response.status).toBe(400);
            expect(response.body).toEqual('Invalid Id');
    })

    test('returns error if person does not exist', async () => {
        const response = await request(app)
            .get('/person/22222222222/scheduleHistory');

            expect(response.status).toBe(404);
            expect(response.body).toEqual("There is no person with cpf as 22222222222");
    })

    test('returns message if cpf doesnt have anything scheduled', async () => {
        const response = await request(app)
            .get('/person/11111111111/scheduleHistory');

            expect(response.status).toBe(200);
            expect(response.body).toEqual("The person with cpf as 11111111111 has no pet");
    })
})

describe('GET /person/:id/schedule', () => {
    test('returns person 81463743911 current schedule', async () => {
        const response = await request(app)
            .get('/person/12345678900/schedule');
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);

        // Checks if each element has property schedule #1
        expect(response.body[0]).toHaveProperty('id_schedule');
        expect(response.body[0]).toHaveProperty('id_animal');
        expect(response.body[0]).toHaveProperty('id_person');
        expect(response.body[0]).toHaveProperty('id_service');
        expect(response.body[0]).toHaveProperty('date_service');

        expect(response.body[0].id_schedule).toBe(201);
        expect(response.body[0].id_animal).toBe(151);
        expect(response.body[0].id_person).toBe('12345678900');
        expect(response.body[0].id_service).toBe(3);
        expect(response.body[0].date_service).toBe('2023-04-15T16:00:00.000Z');


        expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })


    test('returns message if cpf doesnt have anything scheduled', async () => {
        const response = await request(app)
            .get('/person/28138552030/schedule');
            
            expect(response.status).toBe(200);
            expect(response.body).toEqual("The person with cpf as 28138552030 has no pet");
    })
})

// Tests get route for person
describe('GET /person', () => {
    test('returns every person', async () => {
        const response = await request(app)
            .get('/person');
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(102);
        expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })
})

// Tests patch route for person
describe('PATCH /person/:id', () => {
    test('updates a person', async () => {
        const response = await request(app)
            .patch('/person/34749795425')
            .send({
                full_name:"Ana Maria Braga"
            });

            expect(response.status).toBe(200);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body).toHaveLength(1);

            expect(response.body[0]).toHaveProperty('full_name');
            expect(response.body[0].full_name).toBe('Ana Maria Braga');
    })

    test('returns error if person is empty', async () => {
        const response = await request(app)
            .patch('/person/12345678900')
            .send({});

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })

    test('returns error at attempt of changing cpf', async () => {
        const response = await request(app)
            .patch('/person/12345678900')
            .send({
                cpf: "12345678901"
            });

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body).toEqual("CPF cannot be changed");

    })

    test('returns error if tries to change person that doesnt exist', async () => {
        const response = await request(app)
            .patch('/person/12345678910')
            .send({
                full_name: "Tester"
            });

            expect(response.status).toBe(404);
            expect(response.body).toEqual("There is no person with cpf as 12345678910");

    })

    test('returns error if persons cpf is not numeric', async () => {
        const response = await request(app)
            .patch('/person/1234567890a')
            .send({
                price: 80
            });

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body).toEqual("Invalid Id");

    })
})

// Tests delete route for person
describe('DELETE /person', () => {
    test('deletes person 11111111111', async () => {
        const response = await request(app)
            .delete('/person/11111111111');
        
        expect(response.status).toBe(200);
        expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        expect(response.body.rows[0]).toHaveProperty('cpf');
        expect(response.body.rows[0]).toHaveProperty('full_name');
        expect(response.body.rows[0]).toHaveProperty('date_birth');
        expect(response.body.rows[0]).toHaveProperty('number');
        expect(response.body.rows[0]).toHaveProperty('road');
        expect(response.body.rows[0]).toHaveProperty('city');
        expect(response.body.rows[0]).toHaveProperty('postal_code');
        expect(response.body.rows[0]).toHaveProperty('phone');
        expect(response.body.rows[0].cpf).toBe('11111111111');
        expect(response.body.rows[0].full_name).toBe('Mr.Smiley');
        expect(response.body.rows[0].date_birth).toContain('1999-01-31');
    })

    test('returns error if person does not exist', async () => {
        const response = await request(app)
            .delete('/person/99999999999');

            expect(response.status).toBe(404);
            expect(response.body).toEqual("There is no person with cpf as 99999999999");
    })

    test('returns error if id is not a number', async () => {
        const response = await request(app)
            .delete('/person/9999999999a');

            expect(response.status).toBe(400);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body).toEqual("Invalid Id");

    })
})

