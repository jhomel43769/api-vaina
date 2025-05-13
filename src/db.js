import mysql2 from "mysql2/promise";

export const connectDb = await mysql2.createPool({
    host:'localhost',
    user:'root',
    database:'friendship_app',
    password:'root'
})

