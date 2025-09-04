import express from "express";
import pgClient from "../db.js";

const UserRoutes = express.Router();


UserRoutes.get("/courses", async (req, res) => {

    const response = await pgClient.query('SELECT * FROM courses');
    res.json(response.rows);
});


UserRoutes.post('/Login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }
    try {
        // Query the database for a user with matching email and password
        const result = await pgClient.query('SELECT role, username FROM users WHERE email = $1 AND password = $2', [email, password]);
        if (!result.rows || result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }
        // Return the role and username of the user
        return res.json({ role: result.rows[0].role, username: result.rows[0].username });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
});


UserRoutes.post('/addCart', async (req, res) => {
    const {
        username,
        email,
        title,
        instructor,
        price,
        category,
        duration,
        lessons_count,
        rating
    } = req.body;

    if (!username || !email || !title || !instructor || price === undefined || !category || !duration || lessons_count === undefined || rating === undefined) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const query = `INSERT INTO cart_products (username, email, title, instructor, price, category, duration, lessons_count, rating)
                       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;
        const values = [username, email, title, instructor, price, category, duration, lessons_count, rating];

        const result = await pgClient.query(query, values);
        return res.status(201).json({ product: result.rows[0] });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
});








export default UserRoutes;


