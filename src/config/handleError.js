const handleError = (errMessage, err, res, db) => {
    console.error(errMessage, err);

    // ตรวจสอบการเชื่อมต่อก่อนที่จะปิด
    if (db && db.end) {
        db.end((endErr) => {
            if (endErr) {
                console.error('Error closing connection:', endErr);
            }
        });
    }

    // ส่งสถานะ 500 กลับไปยัง client
    return res.status(500).send("Internal Server Error");
};

module.exports = handleError;