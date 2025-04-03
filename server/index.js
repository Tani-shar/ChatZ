import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import AuthRoutes from './routes/AuthRoutes.js';
import contactRoutes from './routes/ContactRoutes.js';
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const databaseURL = process.env.DATABASE_URL;


app.use(cors({
  origin: [process.env.ORIGIN],
  methods: ['GET', 'POST', 'PUT','PATCH','DELETE'],
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth",AuthRoutes);
app.use("/api/contacts", contactRoutes);

const server = app.listen(port, () => {
  console.log(`Server is running on port: ${port}` );
});

mongoose
    .connect(databaseURL)
    .then(() => {
        console.log('Connected to MongoDB database');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });


