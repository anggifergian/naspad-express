const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');

let server;

describe('/api/genres', () => {
    // Run any code before tests start
    beforeEach(() => { server = require('../../server'); });

    // Reset the db every time tests start
    afterEach(async () => {
        server.close();
        await Genre.deleteMany({});
    });

    describe('GET /', () => {
        it('should return all genres.', async () => {
            await Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' }
            ]);

            const res = await request(server).get('/api/v1/genres');

            expect(res.status).toBe(200);
            expect(res.body.data.length).toBe(2);
            expect(res.body.data.some(item => item.name === 'genre1')).toBeTruthy();
            expect(res.body.data.some(item => item.name === 'genre2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return a genre if valid id is passed.', async () => {
            const genre = new Genre({ name: 'genre1' });
            await genre.save();

            const res = await request(server).get('/api/v1/genres/' + genre._id);

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty('name', 'genre1');
        });

        it('should return 400 if invalid id is passed.', async () => {
            const res = await request(server).get('/api/v1/genres/1');

            expect(res.status).toBe(400);
            expect(res.body.message).toContain('Please input valid ID.');
        });

        it('should return 404 if genre with valid id was not found.', async () => {
            const res = await request(server).get('/api/v1/genres/551137c2f9e1fac808a5f572');

            expect(res.status).toBe(404);
            expect(res.body.message).toContain('The genre with the given ID was not found.');
        });
    });

    describe('POST /', () => {
        it('should return 401 if client is not logged in.', async () => {
            const res = await request(server).post('/api/v1/genres').send({ name: 'genre1' });

            expect(res.status).toBe(401);
        });

        it('should return 400 if genres is less than 5 characters.', async () => {
            const token = new User().generateAuthToken();

            const res = await request(server)
                .post('/api/v1/genres')
                .set('x-auth-token', token)
                .send({ name: '1234' });

            expect(res.status).toBe(400);
        });

        it('should return 400 if genres is more than 50 characters.', async () => {
            const token = new User().generateAuthToken();

            const res = await request(server)
                .post('/api/v1/genres')
                .set('x-auth-token', token)
                .send({ name: new Array(52).join('a') });

            expect(res.status).toBe(400);
        });

        it('should save the genre if it is valid.', async () => {
            const token = new User().generateAuthToken();

            const res = await request(server)
                .post('/api/v1/genres')
                .set('x-auth-token', token)
                .send({ name: 'genre1' });

            const genre = await Genre.find({ name: 'genre1' });
            
            expect(genre).not.toBeNull();
        });

        it('should return the genre if it is valid.', async () => {
            const token = new User().generateAuthToken();

            const res = await request(server)
                .post('/api/v1/genres')
                .set('x-auth-token', token)
                .send({ name: 'genre1' });
            
            expect(res.body.data).toHaveProperty('_id');
            expect(res.body.data).toHaveProperty('name', 'genre1');
        });
    });
});