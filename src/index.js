import dotenv from 'dotenv';

dotenv.config();
const { PORT, MONGO_URI } = process.env;

import express from 'express';

const app = express();

app.use(express.json());
app.use(express.static('./client/dist/'));

import path from 'path';

app.get('/admin', (req, res) => {
    res.sendFile(path.resolve('./client/dist/admin.html'));
});

import cors from 'cors';

app.use(cors());

import mongoose from 'mongoose';

mongoose.connect(MONGO_URI).then(() => {
    console.log('[Connect MongoDB]');
});

import voteRouter from './routers/vote.js';
import pollRouter from './routers/poll.js';

app.use('/vote', voteRouter);
app.use('/poll', pollRouter);

app.listen(PORT, () => {
    console.log('[Start Server]: ' + PORT);
});
