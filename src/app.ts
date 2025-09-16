import express, { type Request, type Response } from 'express';
import router from './routes/user-router.ts';

const app = express();

app.use(express.json());

app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from setup file');
});

export default app;
