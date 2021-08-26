const {Sequelize, Model, DataTypes} = require('sequelize');

const logger = require('../log');

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: 'localhost',
  dialect: 'mariadb',
  logging: (msg) => logger.info(msg),
  define: {
    timestamps: false
  },
  pool: {
    max: 10,
    min: 0,
    idle: 10000
  }
});

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'ID'
  },
  firstName: {
    type: DataTypes.STRING(30),
    notNull: true,
    field: 'FIRST_NAME'
  },
  lastName: {
    type: DataTypes.STRING(30),
    notNull: true,
    field: 'LAST_NAME'
  },
  email: {
    type: DataTypes.STRING(50),
    notNull: true,
    unique: true,
    field: 'EMAIL'
  },
  nickname: {
    type: DataTypes.STRING(60),
    field: 'NICKNAME'
  },
  verified: {
    type: DataTypes.BOOLEAN,
    default: false,
    field: 'VERIFIED'
  },
  snowflake: {
    type: DataTypes.STRING(30),
    unique: true,
    field: 'SNOWFLAKE'
  }
}, {
  tableName: 'USERS',
  timestamps: false
});

const Role = sequelize.define('role', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'ID'
  },
  className: {
    type: DataTypes.STRING(40),
    field: 'CLASS_NAME'
  },
  crs: {
    type: DataTypes.CHAR(5),
    field: 'CRS'
  },
  semester: {
    type: DataTypes.STRING(10),
    field: 'SEMESTER'
  },
  discordName: {
    type: DataTypes.STRING(40),
    notNull: true,
    field: 'DISCORD_NAME'
  },
  snowflake: {
    type: DataTypes.STRING(30),
    notNull: true,
    unique: true,
    field: 'SNOWFLAKE'
  },
  joinable: {
    type: DataTypes.BOOLEAN,
    default: false,
    field: 'JOINABLE'
  }
}, {
  tableName: 'ROLES',
  timestamps: false
});

const UserRole = sequelize.define('userRole', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'ID'
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    },
    notNull: true,
    field: 'USER_ID'
  },
  roleId: {
    type: DataTypes.INTEGER,
    references: {
      model: Role,
      key: 'id'
    },
    notNull: true,
    field: 'ROLE_ID'
  }
}, {
  tableName: 'USER_ROLE',
  timestamps: false
});

const Token = sequelize.define('token', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'ID'
  },
  token: {
    type: DataTypes.CHAR(50),
    notNull: true,
    unique: true,
    field: 'TOKEN'
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    },
    notNull: true,
    field: 'USER_ID'
  },
  snowflake: {
    type: DataTypes.STRING(30),
    notNull: true,
    field: 'SNOWFLAKE'
  },
  createdAt: {
    type: 'TIMESTAMP',
    defaultVale: Sequelize.literal('CURRENT_TIMESTAMP'),
    field: 'CREATED_AT'
  }
}, {
  tableName: 'TOKENS',
  timestamps: false
});

const Channel = sequelize.define('channel',  {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'ID'
  },
  name: {
    type: DataTypes.STRING(50),
    notNull: true,
    unique: true,
    field: 'NAME'
  },
  snowflake: {
    type: DataTypes.STRING(30),
    notNull: true,
    unique: true,
    field: 'SNOWFLAKE'
  },
  category: {
    type: DataTypes.STRING(50),
    field: 'CATEGORY'
  }
}, {
  tableName: 'CHANNELS',
  timestamps: false
});

const ChannelRole = sequelize.define('channelRole', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'ID'
  },
  channelId: {
    type: DataTypes.INTEGER,
    notNull: true,
    references: {
      model: Channel,
      key: 'id'
    },
    field: 'CHANNEL_ID'
  },
  roleId: {
    type: DataTypes.INTEGER,
    notNull: true,
    references: {
      model: Role,
      key: 'id'
    },
    field: 'ROLE_ID'
  }
}, {
  tableName: 'CHANNEL_ROLE',
  timestamps: false
});

User.belongsToMany(Role, {through: UserRole, foreignKey: 'userId', otherKey: 'roleId'});
Role.belongsToMany(User, {through: UserRole, foreignKey: 'roleId', otherKey: 'userId'});
User.hasOne(Token, {foreignKey: 'USER_ID'});
Token.belongsTo(User, {foreignKey: 'USER_ID', targetKey: 'id'});
Role.belongsToMany(Channel, {through: ChannelRole, foreignKey: 'roleId', otherKey: 'channelId'});
Channel.belongsToMany(Role, {through: ChannelRole, foreignKey: 'channelId', otherKey: 'roleId'});

exports.sequelize = sequelize;
exports.User = User;
exports.Role = Role;
exports.UserRole = UserRole;
exports.Token = Token;
exports.Channel = Channel;
exports.ChannelRole = ChannelRole;