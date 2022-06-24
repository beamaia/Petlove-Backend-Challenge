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
        
        
        // Its not possible to check length since the seed uses the database random
        expect(response.status).toBe(400);
        expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })

    test('returns error at attempt to change schedule id', async () => {
        const response = await request(app)
            .patch('/schedule/202')
            .send({
                id_schedule: 2002
            });
        
        
        // Its not possible to check length since the seed uses the database random
        expect(response.status).toBe(400);
        expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })

    test('returns error at attempt to change animal id', async () => {
        const response = await request(app)
            .patch('/schedule/202')
            .send({
                id_animal: 151
            });
        
        
        // Its not possible to check length since the seed uses the database random
        expect(response.status).toBe(400);
        expect(response.header['content-type']).toBe('application/json; charset=utf-8');
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
    })
});    

// Tests post route for schedule
describe('DELETE /schedule', () => {
    test('deletes schedule by id', async () => {
        const response = await request(app)
            .delete('/schedule/202');

        expect(response.status).toBe(200);
        expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })
});    
