const express=require('express');
const app=express();
const path=require('path');
const sequelize=require('./utils/database');
const cors=require('cors');
const User=require('./models/user.model');
const Message=require('./models/message.model');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));

User.hasMany(Message,{foreignKey: 'userId'});
Message.belongsTo(User,{foreignKey: 'userId'});

const userRoutes=require('./routes/user-routes');
const chatRoutes=require('./routes/chat-routes');

app.use(userRoutes);
app.use(chatRoutes);

sequelize.sync().then(()=>{
    app.listen(5000,()=>{
        console.log('server started');
    });
})

