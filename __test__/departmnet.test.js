const request = require('supertest');
const app = require('../src/app');

describe('Department API Endpoints', () => {
    let departmentId;

    // Create a department before running update and delete tests
    beforeAll(async () => {
        const res = await request(app)
            .post('/api/department/create-new-department')
            .send({ departmentName: 'Initial Department' });

        // Save the ID for later tests
        departmentId = res.body.id;
    });

    // Test for creating a new department
    it('should create a new department', async () => {
        const res = await request(app)
            .post('/api/department/create-new-department')
            .send({ departmentName: 'Test Department' });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe('Department created successfully');
        expect(res.body).toHaveProperty('id');
    });

    // Test for fetching all departments
    it('should fetch all departments', async () => {
        const res = await request(app).get('/api/department/fetch-all-department');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
    });

    // Test for updating a department
    it('should update an existing department', async () => {
        const res = await request(app)
            .put(`/api/department/update-department/${departmentId}`)
            .send({ departmentName: 'Updated Department' });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe('Department updated successfully');
    });

    // Test for deleting a department
    it('should delete a department', async () => {
        const res = await request(app).delete(`/api/department/delete-department/${departmentId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe('Department deleted successfully');
    });
});
