const request = require('supertest');
const app = require('../src/config/customExpress');
const aux = require('../src/utils/utils');
const db = require('../src/database/db')

afterAll(async () => await db.end());

// Tests post route for schedule
describe('POST /schedule', () => {
    test('posts schedule', async () => {
        const response = await request(app)
            .post('/schedule')
            .send({
                id_person: "12345678900",
                id_animal: 151,
                id_service: 4,
                date_service: "2023-04-12 10:00",
                id_schedule: 202
            });
        

        expect(response.status).toBe(200);
        expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        expect(response.body[0]).toHaveProperty('id_person')
        expect(response.body[0]).toHaveProperty('id_animal')
        expect(response.body[0]).toHaveProperty('id_service')
        expect(response.body[0]).toHaveProperty('date_service')
    })

    test('returns error after trying to insert schedule in unavailable hour', async () => {
        const response = await request(app)
            .post('/schedule')
            .send({
                id_person: "12345678900",
                id_animal: 151,
                id_service: 4,
                date_service: "2023-04-12 10:00",
            });
        

        expect(response.status).toBe(400);
        expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })

    test('returns error after trying to insert schedule with an attribute with empty string', async () => {
        const response = await request(app)
            .post('/schedule')
            .send({
                id_person: "12345678900",
                id_animal: 151,
                id_service: 4,
                date_service: "",
            });
        

        expect(response.status).toBe(400);
        expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })

    test('returns error after trying to insert schedule with an attribute with empty string', async () => {
        const response = await request(app)
            .post('/schedule')
            .send({
                id_person: "12345678900",
                id_animal: 151,
                id_service: 4,
                date_service: "",
            });
        

        expect(response.status).toBe(400);
        expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })

    test('returns error after trying to insert schedule with an attribute with unknown fk', async () => {
        const response = await request(app)
            .post('/schedule')
            .send({
                id_person: "12345678907",
                id_animal: 151,
                id_service: 4,
                date_service: "2025-03-12 14:34",
            });
        

        expect(response.status).toBe(400);
        expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })


});    

// Tests get route for schedule
describe('GET /schedule', () => {
    test('returns all current schedule', async () => {
        const response = await request(app)
            .get('/schedule');
        

        // Its not possible to check length since the seed uses the database random
        expect(response.status).toBe(200);
        expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })
});    

// Tests get route for scheduleHistory
describe('GET /scheduleHistory', () => {
    test('returns all current schedule', async () => {
        const response = await request(app)
            .get('/scheduleHistory');
        

        // Its not possible to check length since the seed uses the database random
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(202)
        expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })
});    

// Tests patch route for schedule
describe('PATCH /schedule/:id', () => {
    test('returns all current schedule', async () => {
        const response = await request(app)
            .patch('/schedule/202')
            .send({
                date_service: "2025-03-03 13:46"
            });
        
        
        // Its not possible to check length since the seed uses the database random
        expect(response.status).toBe(200);
        expect(response.body[0]).toHaveProperty("id_schedule")
        expect(response.body[0]).toHaveProperty("id_person")
        expect(response.body[0]).toHaveProperty("id_animal")
        expect(response.body[0]).toHaveProperty("id_service")
        expect(response.body[0]).toHaveProperty("date_service")

        expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })

    test('returns error at attempt to change service', async () => {
        const response = await request(app)
            .patch('/schedule/202')
            .send({
                id_service: 2
            });
        
        
        expect(response.status).toBe(400);
        expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        expect(response.body).toBe("Service cannot be changed, create a new schedule!");
    })

    test('returns error at attempt to change schedule id', async () => {
        const response = await request(app)
            .patch('/schedule/202')
            .send({
                id_schedule: 2002
            });
        
        
        expect(response.status).toBe(400);
        expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        expect(response.body).toBe("Id cannot be changed");
    })

    test('returns error at attempt to change animal id', async () => {
        const response = await request(app)
            .patch('/schedule/202')
            .send({
                id_animal: 151
            });
        
        
        expect(response.status).toBe(400);
        expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        expect(response.body).toBe("Pet cannot be changed, create a new schedule!");
    })

    test('returns error at attempt to change person', async () => {
        const response = await request(app)
            .patch('/schedule/202')
            .send({
                id_person: "12345678900"
            });
        
        
        // Its not possible to check length since the seed uses the database random
        expect(response.status).toBe(400);
        expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        expect(response.body).toBe("Person cannot be changed, create a new schedule!");
    })

    test('returns error at attempt to change date_service to empty string', async () => {
        const response = await request(app)
            .patch('/schedule/202')
            .send({
                date_service: ""
            });
        
        
        // Its not possible to check length since the seed uses the database random
        expect(response.status).toBe(400);
        expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        expect(response.body).toBe("date_service cannot be empty");
    })

    test('returns error if schedule id has letters', async () => {
        const response = await request(app)
            .patch('/schedule/202a')
            .send({
                date_service: "2025-03-03 13:47"
            });
        
        
        // Its not possible to check length since the seed uses the database random
        expect(response.status).toBe(400);
        expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        expect(response.body).toBe("Invalid Id");
    })

    test('returns error if schedule id doesnt exist', async () => {
        const response = await request(app)
            .patch('/schedule/2022')
            .send({
                date_service: "2025-03-03 13:47"
            });
        
        
        // Its not possible to check length since the seed uses the database random
        expect(response.status).toBe(404);
        expect(response.body).toBe("There is no schedule with id as 2022");
    })
});    

// Tests post route for schedule
describe('DELETE /schedule', () => {
    test('deletes schedule by id', async () => {
        const response = await request(app)
            .delete('/schedule/202');

        expect(response.status).toBe(200);
        expect(response.header['content-type']).toBe('application/json; charset=utf-8');

        expect(response.body[0]).toHaveProperty("id_schedule")
        expect(response.body[0]).toHaveProperty("id_person")
        expect(response.body[0]).toHaveProperty("id_animal")
        expect(response.body[0]).toHaveProperty("id_service")
        expect(response.body[0]).toHaveProperty("date_service")
        expect(response.body).toHaveLength(1)
        
        expect(response.body[0].id_schedule).toBe(202)
        expect(response.body[0].id_person).toBe("12345678900")
        expect(response.body[0].id_animal).toBe(151)
        expect(response.body[0].id_service).toBe(4)
        expect(response.body[0].date_service).toBe("2025-03-03T16:46:00.000Z")
    })

    test('returns error at attempt to deletes schedule with id with letters', async () => {
        const response = await request(app)
            .delete('/schedule/202a');

        expect(response.status).toBe(400);
        expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        expect(response.body).toBe("Invalid Id");
    })

    test('returns error at attempt to deletes schedule that doesnt exist', async () => {
        const response = await request(app)
            .delete('/schedule/2022');

        expect(response.status).toBe(404);
        expect(response.body).toBe("There is no schedule with id as 2022");
    })
});    
