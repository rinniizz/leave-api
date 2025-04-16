const app = require('./src/app');
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, HOST, async () => {
    console.log(`Server started on http://${HOST}:${PORT}`);
});
