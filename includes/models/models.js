const { DataTypes } = require('sequelize')
const sequelize = require('./db')

const Queue = sequelize.define('Queue', {
    number: {
        type: DataTypes.INTEGER(11),
        allowNull: true
    },
    date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    purpose_title: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    purpose_description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'queue',
    timestamps: false,
    engine: 'MyISAM'
});

const SystemUser = sequelize.define('SystemUser', {
    username: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    display_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    tableName: 'system_user',
    timestamps: false,
    engine: 'MyISAM'
})

const transacCount = sequelize.define('transacCount', {
    count: {
        type: DataTypes.INTEGER(11),
        allowNull: true
    },
    date: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'transac_count',
    timestamps: false,
    engine: 'MyISAM'
})

module.exports = { Queue, SystemUser, transacCount }