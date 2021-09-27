import express from 'express';
import cors from 'cors';
import download from './api/download.js';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  exposedHeaders: ['title']
}));

app.use('/api/download', download);

const server = app.listen(8000, function() {
  console.log(`Server listening at port ${this.address().port}`);
});

export default server;