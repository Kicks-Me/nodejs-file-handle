import express from 'express';
import bodyParser from 'body-parser';
import route from './routes/index.route.js';

const app = express();
app.use(bodyParser.json());

app.use('/api', route);


app.listen(8088,()=>{
    console.log(`App is running on port 8088`);
})