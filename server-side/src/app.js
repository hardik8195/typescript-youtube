import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config({
    path: './.env'
})

const app = express();
app.enable("trust proxy")

app.use(cors({
  origin:'*',
  methods:["POST","GET","PUT","PATCH","DELETE"],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials:true
}))


app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({extended:true,limit:'16kb'}))
app.use(express.static('public'))
app.use(cookieParser())


app.get('/', (req, res) => {
  res.sendFile('index.html');
});
//router import
import userRouter from './routes/user.route.js';
import vedioRouter from './routes/video.route.js'
import commentRouter from './routes/comment.route.js'

//router declaration
app.use("/api/v1/users",userRouter);
app.use("/api/v1/videos",vedioRouter);
app.use("/api/v1/comments",commentRouter);

export {app}
