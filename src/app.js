import express from 'express';
import path from 'path';
import logger from 'morgan';
import env from 'dotenv';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import helmet from 'helmet';


env.config();

import routes from './api/router';
const app = express();
app.use(helmet());
app.use(cors());
app.use(logger('dev'));

app.use(express.json());
app.use(
    express.urlencoded({
        extended: false,
    }),
);
app.use(fileUpload());

app.use(express.static(path.join(__dirname, './public')));



app.use('/api/v1/', ...routes);

export default app;