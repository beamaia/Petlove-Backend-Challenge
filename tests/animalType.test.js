const request = require('supertest');
const app = require('../src/config/customExpress');
const aux = require('../src/utils/utils');
const db = require('../src/database/db')

afterAll(() => db.end());



describe('GET /animalType', () => {
    test('returns all animals types', async () => {
        const response = await request(app)
            .get('/animalType');
        

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(46);
        expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        
        })
});    