const express = require('express');
const app = express();
const path = require('path');
const sequelize = require('./utils/database');
const cors = require('cors');
const User = require('./models/user.model');
const Message = require('./models/message.model');
const Group = require('./models/group.model');
const UserToGroup = require('./models/userGroup.model');


const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer(app);
const io = new Server(httpServer,{cors : {origin :"*"}});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

User.hasMany(Message, { foreignKey: 'userId' });
Message.belongsTo(User, { foreignKey: 'userId' });

Group.hasMany(Message, { foreignKey: 'groupId' });
Message.belongsTo(Group, { foreignKey: 'groupId' });

User.belongsToMany(Group, { through: UserToGroup });
Group.belongsToMany(User, { through: UserToGroup });

const userRoutes = require('./routes/user-routes');
const chatRoutes = require('./routes/chat-routes');
const groupRoutes = require('./routes/group-routes');


app.use(userRoutes);
app.use(chatRoutes);
app.use(groupRoutes);

io.on("connection", (socket) => {
  socket.on('chat message',(message)=>{
    io.emit('chat message',message);
  })
  socket.on('user typing',(obj)=>{
    io.emit('user typing',obj)
  })
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});


sequelize.sync({ alter: true }).then(() => {
    httpServer.listen(5000, () => {
        console.log('server started');
    });
});







