import { Sequelize } from "sequelize";
import dotenv from 'dotenv'
dotenv.config()
const seq = new Sequelize(String(process.env.DBNAME), String(process.env.DBUSER), String(process.env.DBPASSWORD), 
{
    host:process.env.DBHOST,
    port:Number(process.env.DBPORT),
    dialect:'mysql',
    logging: console.log,

})

export { seq }