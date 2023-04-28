const express= require('express');
const app=express();
const bodyParser = require('body-parser');

const mongoose= require('mongoose');
const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
const dburl="mongodb://127.0.0.1:27017/Signup";
mongoose.connect( dburl, connectionParams);

const user= require('./routers/user');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello');
  });

app.use('/api/v1/User',user);

app.listen(8000,function(req,res){
    console.log('connected to port:8000');
});