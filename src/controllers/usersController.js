const dbConfig = require("../config/dbConfig");
const handleError = require("../config/handleError");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");


exports.regisUser = async (req, res) => {
    const { email, password, emp_name, emp_department, emp_role } = req.body;

    if (!email || !password || !emp_name || !emp_department || !emp_role) {
        return res.status(400).json({ error: "All fields are required: email, password, emp_name, emp_department, emp_role" });
    }

    const db = await mysql.createConnection(dbConfig);

    try {
        // Check if user already exists
        const [existingUser] = await db.query("SELECT * FROM employee WHERE emp_email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(409).json({ error: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const [result] = await db.query(
            "INSERT INTO employee (emp_email, emp_name, emp_password, emp_department, emp_role) VALUES (?, ?, ?, ?, ?)",
            [email, emp_name, hashedPassword, emp_department, emp_role]
        );

        // Get the inserted ID
        const insertedId = result.insertId;

        // Fetch leave type data
        const [leavetype] = await db.query("SELECT * FROM leave_type");

        // Prepare leave data for insertion
        const leaveData = [
            insertedId,
            leavetype[0]?.leave_limit || 0,
            leavetype[1]?.leave_limit || 0,
            leavetype[2]?.leave_limit || 0,
            leavetype[3]?.leave_limit || 0,
            leavetype[4]?.leave_limit || 0,
            leavetype[5]?.leave_limit || 0,
            leavetype[6]?.leave_limit || 0,
            leavetype[7]?.leave_limit || 0,
            leavetype[8]?.leave_limit || 0,
            leavetype[9]?.leave_limit || 0,
            leavetype[10]?.leave_limit || 0,
            leavetype[11]?.leave_limit || 0,
            leavetype[12]?.leave_limit || 0,
            leavetype[13]?.leave_limit || 0,
        ];

        // Insert leave data into leave_data table
        await db.query(
            `INSERT INTO leave_data (
                idemployee, 
                leave_datacol1, 
                leave_datacol2, 
                leave_datacol3, 
                leave_datacol4, 
                leave_datacol5, 
                leave_datacol6, 
                leave_datacol7, 
                leave_datacol8, 
                leave_datacol9, 
                leave_datacol10, 
                leave_datacol11, 
                leave_datacol12, 
                leave_datacol13, 
                leave_datacol14
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            leaveData
        );

        res.status(201).json({ message: "User registered successfully", userId: insertedId });
    } catch (error) {
        console.error("Error registering user:", error.message);
        handleError(error, res);
    } finally {
        if (db) await db.end();
    }
};

exports.getAllUser = async (req, res) => {
    const db = await mysql.createConnection(dbConfig);

    try {
        const [users] = await db.query(`
            SELECT 
                employee.idemployee,
                employee.emp_email,
                employee.emp_name,
                department.dep_name,
                employee.emp_role,
                leave_data.leave_datacol1, 
                leave_data.leave_datacol2, 
                leave_data.leave_datacol3, 
                leave_data.leave_datacol4, 
                leave_data.leave_datacol5, 
                leave_data.leave_datacol6, 
                leave_data.leave_datacol7, 
                leave_data.leave_datacol8, 
                leave_data.leave_datacol9, 
                leave_data.leave_datacol10, 
                leave_data.leave_datacol11, 
                leave_data.leave_datacol12, 
                leave_data.leave_datacol13, 
                leave_data.leave_datacol14
            FROM 
                employee
            LEFT JOIN department ON employee.emp_department = department.iddepartment
            LEFT JOIN leave_data ON employee.idemployee = leave_data.idemployee
        `);
        return res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching user data:', err.message);
        return res.status(500).json({ error: 'Database operation error' });
    } finally {
        if (db) await db.end();
    }
};


exports.getUserById = async (req, res) => {
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
                leave_data.leave_datacol1, 
                leave_data.leave_datacol2, 
                leave_data.leave_datacol3, 
                leave_data.leave_datacol4, 
                leave_data.leave_datacol5, 
                leave_data.leave_datacol6, 
                leave_data.leave_datacol7, 
                leave_data.leave_datacol8, 
                leave_data.leave_datacol9, 
                leave_data.leave_datacol10, 
                leave_data.leave_datacol11, 
                leave_data.leave_datacol12, 
                leave_data.leave_datacol13, 
                leave_data.leave_datacol14
            FROM 
                employee
            LEFT JOIN department ON employee.emp_department = department.iddepartment
            LEFT JOIN leave_data ON employee.idemployee = leave_data.idemployee
            WHERE employee.idemployee = ?
        `, [id]);

        if (users.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json(users[0]);
    } catch (err) {
        console.error('Error fetching user data:', err.message);
        return res.status(500).json({ error: 'Database operation error' });
    } finally {
        if (db) await db.end();
    }
};


