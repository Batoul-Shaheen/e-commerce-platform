import express from "express";
import { initDB } from "./DB/dataSource.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());



app.listen(PORT, () => {
    console.log(`APP is listining in port ${PORT}`);
    initDB();
});

export default app;