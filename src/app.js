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

const port = process.env.PORT || '4000'


app.use('/api/v1/', ...routes);
app.get('/', (req, res) => {
    res.status(200).json({
        msg: `Welcome to A REST API based application that can be  use to compare two uploaded files content  for similarity. Please refer to the api collection`,
        postman_docs: 'https://documenter.getpostman.com/view/3358987/SzKPX2v1?version=latest'

    });
});

export default app;