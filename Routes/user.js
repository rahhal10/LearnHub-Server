import express from "express";
import pgClient from "../db.js";

const UserRoutes = express.Router();


UserRoutes.get("/courses", async (req, res) => {

    const response = await pgClient.query('SELECT * FROM courses');
    res.json(response.rows);
});












export default UserRoutes;
