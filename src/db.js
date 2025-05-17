import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  "friendship_app", 
  "root",            
  "root",           
  {
    host: "localhost",
    dialect: "mysql",
    logging: false,   
    pool: {
      max: 5,        
      min: 0,
      acquire: 300,
      idle: 100,
    },
  }
);