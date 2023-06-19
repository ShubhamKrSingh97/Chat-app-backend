const express=require('express');
const app=express();
const path=require('path');
const sequelize=require('./utils/database');
const cors=require('cors');


app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));


const userRoutes=require('./routes/user-routes');

app.use(userRoutes);


sequelize.sync().then(()=>{
    app.listen(5000,()=>{
        console.log('server started');
    });
})

