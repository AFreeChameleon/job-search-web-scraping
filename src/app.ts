require('dotenv').config()
import express, { Application } from 'express';
import * as bodyParser from 'body-parser';
import path from 'path';
import { router as accountRouter } from './routes/account';
import { router as homeRouter } from './routes/home'
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import passportFile from './passport/passport';
passportFile(passport);
//Initialising constants
const app: Application = express();
const PORT: number = parseInt(process.env.PORT!);
const DBNAME: string = process.env.DBNAME!;
//Setting up database
mongoose.connect(`mongodb://localhost:27017/${DBNAME}`)
//Setting up middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/../public')));
app.use(session({
  secret: process.env.SESSIONSECRET!,
  saveUninitialized: false,
  resave: false
}));
app.use(passport.initialize());
app.use(passport.session());
//Setting templating engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/../views'));

//Routes
app.use('/', homeRouter);
app.use('/u', accountRouter);

//Listening on port
app.listen(PORT, () => console.log(`Account server running on port: ${PORT}`))