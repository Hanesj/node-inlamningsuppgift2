import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ path: './config/config.env' });

const app = express();

app.use(cors());
app.use(express.json());

export { app };
