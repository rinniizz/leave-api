// src/controllers/authController.js
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise'); 
const dbConfig = require('../config/dbConfig');
const security = require('../security');
const axios = require('axios');
const https = require('https');

const users = [
    { username: 'testuser', password: 'password', id: 1, isAdmin: true }
];

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    const db = await mysql.createConnection(dbConfig);

    try {
        // ตรวจสอบว่าผู้ใช้งานมีอยู่ในฐานข้อมูลหรือไม่
        const [users] = await db.query("SELECT * FROM employee WHERE emp_email = ?", [email]);

        if (users.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = users[0];

        // ตรวจสอบรหัสผ่าน
        const isPasswordValid = await bcrypt.compare(password, user.emp_password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // ส่งข้อมูลผู้ใช้กลับไป
        return res.status(200).json({
            message: "Login successful",
            email: user.emp_email,
            name: user.emp_name,
            dep: user.emp_department,
            role: user.emp_role
        });
    } catch (err) {
        console.error('Error during login process:', err.message);
        return res.status(500).json({ error: 'Database operation error' });
    } finally {
        if (db) await db.end();
    }
};