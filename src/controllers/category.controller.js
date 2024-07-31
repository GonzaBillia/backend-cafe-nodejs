import { SUCCESS_CATEGORY_CREATED, SUCCESS_CATEGORY_UPDATED, SUCCESS_GET_ALL } from "../constants/messages.constant.js";
import { ERROR_CATEGORY_NOT_FOUND, ERROR_CREATE_CATEGORY, ERROR_QUERY, ERROR_UPDATE_CATEGORY } from "../constants/errors.constant.js";
import connection from "../db/connection.js";
import { authenticate } from "../middlewares/authentication.js";
import { checkRole } from "../middlewares/checkRole.js";

export const getCategories = (req, res) => {
    let query = "SELECT * FROM category ORDER BY name"
    connection.query(query, (err, result) => {
        if(!err){
            return res.status(200).send({message: SUCCESS_GET_ALL, payload: result})
        } else{
            return res.status(500).send({message: ERROR_QUERY, error: err})
        }
    })
}

export const postCategory = (req, res) => {
    let category = req.body
    let query = "INSERT INTO category (name) VALUES (?)"
    connection.query(query, [category.name], (err, result) => {
        if(!err){
            return res.status(200).send({message: SUCCESS_CATEGORY_CREATED, payload: result})
        } else{
            return res.status(500).send({message: ERROR_CREATE_CATEGORY, error: err})
        }
    })
}

export const updateCategory = (req, res) => {
    let category = req.body
    let query = "UPDATE category SET name=? WHERE id=?"
    connection.query(query, [category.name, category.id], (err, result) => {
        if(!err){
            if(result.affectedRows == 0){
                return res.status(404).send({message: ERROR_CATEGORY_NOT_FOUND, error: err})
            } else {
                return res.status(200).send({message: SUCCESS_CATEGORY_UPDATED, payload: result})
            }
        } else{
            return res.status(500).send({message: ERROR_UPDATE_CATEGORY, error: err})
        }
    })
}