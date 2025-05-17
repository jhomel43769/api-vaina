import { Sequelize, DataTypes} from "sequelize";
import sequelize from "../db.js";

const sequelize = new Sequelize.define()

export const user = sequelize.define('user', {

    username: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
    },

    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        uniqueL: true
    },

    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    }

})