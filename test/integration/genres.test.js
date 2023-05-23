const request = require('supertest');
const mongoose = require('mongoose');
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
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get('/api/v1/genres/' + id);

            expect(res.status).toBe(404);
            expect(res.body.message).toContain('The genre with the given ID was not found.');
        });
    });

    describe('POST /', () => {
        let token, name;

        async function exec() {
            return await request(server)
                .post('/api/v1/genres')
                .set('x-auth-token', token)
                .send({ name });
        }

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre1';
        });

        it('should return 401 if client is not logged in.', async () => {
            const res = await request(server).post('/api/v1/genres').send({ name: 'genre1' });

            expect(res.status).toBe(401);
        });

        it('should return 400 if genres is less than 5 characters.', async () => {
            name = '1234';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if genres is more than 50 characters.', async () => {
            name = new Array(52).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should save the genre if it is valid.', async () => {
            await exec();

            const genre = await Genre.find({ name: 'genre1' });

            expect(genre).not.toBeNull();
        });

        it('should return the genre if it is valid.', async () => {
            const res = await exec();

            expect(res.body.data).toHaveProperty('_id');
            expect(res.body.data).toHaveProperty('name', 'genre1');
        });
    });

    describe('PUT /', () => {
        let token;
        let id;
        let newName;
        let genre;

        beforeEach(async () => {
            genre = new Genre({ name: 'genre1' });
            await genre.save();

            id = genre._id;
            token = new User().generateAuthToken();
            newName = 'updatedName'
        });

        function exec() {
            return request(server)
                .put('/api/v1/genres/' + id)
                .set('x-auth-token', token)
                .send({ name: newName });
        }

        it('should return 401 if client is not logged in.', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if invalid id is passed.', async () => {
            id = 1;

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if genres name less than 5 characters.', async () => {
            newName = '1234';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if genres name less than 500 characters.', async () => {
            newName = new Array(52).join('a');
            
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 404 if genre with the given id was not found.', async () => {
            id = mongoose.Types.ObjectId();

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should update the genre if input is valid.', async () => {
            await exec();

            const updatedGenre = await Genre.findById(id);

            expect(updatedGenre.name).toBe(newName);
        });

        it('should return the updated genre if it is valid.', async () => {
            const res = await exec();

            expect(res.body.data).toHaveProperty('_id');
            expect(res.body.data).toHaveProperty('name', newName);
        });
    });
});