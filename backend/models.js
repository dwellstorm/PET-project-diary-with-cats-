import { DataTypes, Sequelize } from 'sequelize'
import {seq} from './db.js'

const Cats = seq.define('cats', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: DataTypes.STRING,
    mood: DataTypes.STRING,
    image_url: DataTypes.STRING,
    color: DataTypes.STRING
}, {
    tableName: 'cats',      
    timestamps: false,     
    underscored: true      
})

const Quotes = seq.define('quotes', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    cat_id: DataTypes.INTEGER,
    quote_text: DataTypes.TEXT,
}, {
    tableName: 'quotes',      
    timestamps: false,     
    underscored: true      
})

const Entries = seq.define('entries', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    cat_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    user_text: DataTypes.TEXT,
    created_at: DataTypes.DATE,
    quote_text: {type: DataTypes.TEXT, allowNull: true}
}, {
    tableName: 'entries',      
    timestamps: true,     
    underscored: true      
})

const User = seq.define('users', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    username: {type: DataTypes.STRING, allowNull: false},
    email: {type: DataTypes.STRING, allowNull: false},
    bio: {type: DataTypes.STRING},
    avatar: {type: DataTypes.STRING},
    password: {type: DataTypes.STRING, allowNull: false},
    role: {type: DataTypes.STRING, allowNull: false},
    activationLink: {type: DataTypes.STRING},
    activated: {type: DataTypes.BOOLEAN},
    resetToken: {type: DataTypes.STRING},
    tempPassword: {type: DataTypes.STRING},
    createdAt: {type: DataTypes.DATE, defaultValue: DataTypes.NOW}
}, 
    {tableName: 'users',
        timestamps: false})

Cats.hasMany(Quotes, {foreignKey: 'cat_id', as: 'quotes'})
Cats.hasMany(Entries, {foreignKey: 'cat_id', as: 'entries'})

Quotes.belongsTo(Cats, {foreignKey: 'cat_id', as: 'cat'})
Entries.belongsTo(Cats, {foreignKey: 'cat_id', as: 'cat'})

User.hasMany(Entries, {foreignKey: 'user_id', as: 'entries'})
Entries.belongsTo(User, { foreignKey: 'user_id', as: 'user' })

export {Cats, Quotes, Entries, User}