const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sql = require('msnodesqlv8');
const bcrypt = require('bcrypt');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files 
app.use(express.static('public'));

const sqlConfig = {
    connectionString: 'Driver={ODBC Driver 17 for SQL Server};Server=MSI\\SQLEXPRESS;Database=travelDb;Trusted_Connection=yes;'
};

// Define a route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Registration endpoint
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // SQL Insert Query
        const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;

        // Use msnodesql to execute the query
        sql.query(sqlConfig.connectionString, query, [name, email, hashedPassword], (err, result) => {
            if (err) {
                console.error('SQL error', err);
                return res.status(500).json({ message: 'Registration failed. Please try again.' });
            }

            // Send success response
            res.json({ message: 'Registration successful!' });
        });
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Contact form submission endpoint
app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body;

    // SQL Insert Query
    const query = `INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)`;

    // Use msnodesql to execute the query
    sql.query(sqlConfig.connectionString, query, [name, email, subject, message], (err, result) => {
        if (err) {
            console.error('SQL error', err);
            return res.status(500).json({ message: 'Failed to send message. Please try again.' });
        }

        // Send success response
        res.json({ message: 'Message sent successfully!' });
    });
});

app.post('/api/book', (req, res) => {
    const { name, email, booking_date, destination } = req.body;

    // SQL Insert Query
    const query = `INSERT INTO bookings (name, email, booking_date, destination) VALUES (?, ?, ?, ?)`;

    // Use msnodesql to execute the query
    sql.query(sqlConfig.connectionString, query, [name, email, booking_date, destination], (err, result) => {
        if (err) {
            console.error('SQL error', err);
            return res.status(500).json({ message: 'Booking failed. Please try again.' });
        }

        res.json({ message: 'Booking successful!' });
    });
});




// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
