const dbConfig = require("../config/dbConfig");
const handleError = require("../config/handleError");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");

exports.leaveType = async (req, res) => {

    const db = await mysql.createConnection(dbConfig);

    try {
        const [leave_type] = await db.query(`SELECT * FROM leave_type `);
        return res.status(200).json(leave_type);
    } catch (err) {
        console.error('Error fetching leave_type data:', err.message);
        return res.status(500).json({ error: 'Database operation error' });
    } finally {
        if (db) await db.end();
    }
}

exports.departmentType = async (req, res) => {

    const db = await mysql.createConnection(dbConfig);

    try {
        const [department] = await db.query(`SELECT * FROM department `);
        return res.status(200).json(department);
    } catch (err) {
        console.error('Error fetching department data:', err.message);
        return res.status(500).json({ error: 'Database operation error' });
    } finally {
        if (db) await db.end();
    }
}