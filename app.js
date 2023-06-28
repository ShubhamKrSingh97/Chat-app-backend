const express = require('express');
const app = express();
const path = require('path');
const sequelize = require('./utils/database');
const cors = require('cors');
const User = require('./models/user.model');
const Message = require('./models/message.model');
const Group = require('./models/group.model');
const UserToGroup = require('./models/userGroup.model');

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

sequelize.sync({ alter: true }).then(() => {
    app.listen(5000, () => {
        console.log('server started');
    });
});

