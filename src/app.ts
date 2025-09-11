import express, { type Request, type Response } from 'express';

const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from setup file');
});

export default app;
