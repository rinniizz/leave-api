const request = require('supertest');
const app = require('../src/app'); // Adjust the path to your app if necessary

describe('Section API Endpoints', () => {
    let sectionId;

    // Create a section before running update and delete tests
    beforeAll(async () => {
        const res = await request(app)
            .post('/api/section/create-new-section')
            .send({ sectionName: 'Initial Section' });

        // Save the ID for later tests
        sectionId = res.body.id;
    });

    // Test for creating a new section
    it('should create a new section', async () => {
        const res = await request(app)
            .post('/api/section/create-new-section')
            .send({ sectionName: 'Test Section' });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe('Section created successfully');
        expect(res.body).toHaveProperty('id');
    });

    // Test for fetching all sections
    it('should fetch all sections', async () => {
        const res = await request(app).get('/api/section/fetch-all-sections');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
    });

    // Test for updating a section
    it('should update an existing section', async () => {
        const res = await request(app)
            .put(`/api/section/update-section/${sectionId}`)
            .send({ sectionName: 'Updated Section' });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe('Section updated successfully');
    });

    // Test for deleting a section
    it('should delete a section', async () => {
        const res = await request(app).delete(`/api/section/delete-section/${sectionId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe('Section deleted successfully');
    });
});