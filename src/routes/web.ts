import {
  Router, Request, Response,
} from 'express';

const Route = Router();

Route.get('/', (req: Request, res: Response) => res.render('welcome.ejs'));

export default Route;
