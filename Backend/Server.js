const cors = require('cors');
const express = require('express');
const db = require('./Config/db');
const userRoutes = require('./Routes/UserRoutes');
const app = express();
const PORT = 8006;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
db.authenticate().then(() => {
    console.log('Database connected successfully');
    db.sync({ force: false })
    // Set force to true if you want to drop existing tables and create new ones
}).catch((error) => {
    console.error('Database connection failed:', error);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});