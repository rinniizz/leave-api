const dbConfig = require("../config/dbConfig");
const handleError = require("../config/handleError");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const e = require("express");


exports.requestLeave = async (req, res) => {
    const { idemployee, idtype , hisnum, hisremark } = req.body;
    console.log("Request Leave Body:", req.body);
    const db = await mysql.createConnection(dbConfig);
    if (!idemployee || !idtype || !hisnum || !hisremark) {
        return res.status(400).json({ error: "All fields are required: idemployee, idtype , hisnum, hisremark" });
    }
    try {
        // Check if user already exists
        const [existingUser] = await db.query("SELECT * FROM employee WHERE idemployee = ?", [idemployee]);
        if (existingUser.length === 0) {
            return res.status(409).json({ error: "User not found" });
        }

        // Insert the new user into the database
        const [result] = await db.query(
            "INSERT INTO leave_hitory (idemployee, idtype , his_num, his_remark, his_date, his_status) VALUES (?, ?, ?, ?, NOW(), 'รออนุมัติ')",
            [idemployee, idtype , hisnum, hisremark]
        );


        return res.status(200).json({ message: "Request leave success" });
    } catch (err) {
        console.error('Error fetching leave_type data:', err.message);
        return res.status(500).json({ error: 'Database operation error' });
    } finally {
        if (db) await db.end();
    }
}


exports.getDataByID = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "User ID is required" });
    }

    const db = await mysql.createConnection(dbConfig);

    try {
        const [users] = await db.query(`
            SELECT 
                employee.idemployee,
                employee.emp_email,
                employee.emp_name,
                department.dep_name,
                employee.emp_role,
                leave_type.leave_name,
                leave_hitory.his_num,
                leave_hitory.his_remark,
                leave_hitory.his_date,
                leave_hitory.his_status
            FROM 
                employee
            LEFT JOIN department ON employee.emp_department = department.iddepartment
            LEFT JOIN leave_data ON employee.idemployee = leave_data.idemployee
            LEFT JOIN leave_hitory ON employee.idemployee = leave_hitory.idemployee
            LEFT JOIN leave_type ON leave_hitory.idtype = leave_type.idleave_type
            WHERE employee.idemployee = ?;
        `, [id]);
        console.log(users);

        if (users.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching user data:', err.message);
        return res.status(500).json({ error: 'Database operation error' });
    } finally {
        if (db) await db.end();
    }
};

exports.getDataReq = async (req, res) => {
    const db = await mysql.createConnection(dbConfig);

    try {
        const [users] = await db.query(`
            SELECT 
                leave_hitory.idleave_hitory,
                leave_hitory.idemployee,
                employee.emp_email,
                employee.emp_name,
                department.dep_name,
                employee.emp_role,
                leave_type.leave_name,
                leave_hitory.his_num,
                leave_hitory.his_remark,
                leave_hitory.his_date,
                leave_hitory.his_status
            FROM 
                leave_hitory
            LEFT JOIN employee ON leave_hitory.idemployee = employee.idemployee
            LEFT JOIN department ON employee.emp_department = department.iddepartment
            LEFT JOIN leave_data ON employee.idemployee = leave_data.idemployee
            LEFT JOIN leave_type ON leave_hitory.idtype = leave_type.idleave_type;
        `);

        if (users.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching user data:', err.message);
        return res.status(500).json({ error: 'Database operation error' });
    } finally {
        if (db) await db.end();
    }
};

exports.getDataReqByID = async (req, res) => {
    const { id } = req.params;
    const db = await mysql.createConnection(dbConfig);

    try {
        const [users] = await db.query(`
            SELECT 
                leave_hitory.idleave_hitory,
                leave_hitory.idemployee,
                employee.emp_email,
                employee.emp_name,
                department.dep_name,
                employee.emp_role,
                leave_type.leave_name,
                leave_hitory.his_num,
                leave_hitory.his_remark,
                leave_hitory.his_date,
                leave_hitory.his_status
            FROM 
                leave_hitory
            LEFT JOIN employee ON leave_hitory.idemployee = employee.idemployee
            LEFT JOIN department ON employee.emp_department = department.iddepartment
            LEFT JOIN leave_data ON employee.idemployee = leave_data.idemployee
            LEFT JOIN leave_type ON leave_hitory.idtype = leave_type.idleave_type
            WHERE leave_hitory.idleave_hitory = ?;
        `, [id]);

        if (users.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching user data:', err.message);
        return res.status(500).json({ error: 'Database operation error' });
    } finally {
        if (db) await db.end();
    }
};


exports.reqApprove = async (req, res) => {
    const { id,approveid,his_status,his_approbedate,his_approveremark,his_agentid } = req.params;
    const db = await mysql.createConnection(dbConfig);

    try {
        const [users] = await db.query(`
            SELECT 
                leave_hitory.idleave_hitory,
                leave_hitory.idemployee,
                employee.emp_email,
                employee.emp_name,
                department.dep_name,
                employee.emp_role,
                leave_type.leave_name,
                leave_hitory.his_num,
                leave_hitory.his_remark,
                leave_hitory.his_date,
                leave_hitory.his_status
            FROM 
                leave_hitory
            LEFT JOIN employee ON leave_hitory.idemployee = employee.idemployee
            LEFT JOIN department ON employee.emp_department = department.iddepartment
            LEFT JOIN leave_data ON employee.idemployee = leave_data.idemployee
            LEFT JOIN leave_type ON leave_hitory.idtype = leave_type.idleave_type
            WHERE leave_hitory.idleave_hitory = ?;
        `, [id]);

        if (users.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching user data:', err.message);
        return res.status(500).json({ error: 'Database operation error' });
    } finally {
        if (db) await db.end();
    }
};