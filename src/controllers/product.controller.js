import { ERROR_CREATE_PRODUCT, ERROR_QUERY } from "../constants/errors.constant.js";
import { SUCCESS_GET_ALL, SUCCESS_PRODUCT_CREATED } from "../constants/messages.constant.js";
import connection from "../db/connection.js";

export const getProducts = (req, res) => {
    let query = 'SELECT p.id, p.title, p.description, p.price/100, p.code, p.stock, p.status, p.thumbnail, c.name AS category FROM product p INNER JOIN category c ON p.category_id = c.id'
    connection.query(query, (err, result) => {
        if (!err) {
            return res.status(200).send({message: SUCCESS_GET_ALL, payload: result})
        } else {
            return res.status(500).send({message: ERROR_QUERY, error: err})
        }
    })
}

export const getProduct = async (req, res) => {}

export const postProduct = (req, res) => {
    let product = req.body
    let query = 'INSERT INTO product (title, description, price, category_id, code, stock, status) VALUES (?, ?, ?, ?, ?, ?, "true")'
    connection.query(query, [product.title, product.description, product.price, product.category_id, product.code, product.stock], (err, result) => {
        
        if (!err) {
            return res.status(200).send({message: SUCCESS_PRODUCT_CREATED, payload: result})
        } else {
            return res.status(500).send({message: ERROR_CREATE_PRODUCT, error: err})
        }
    })
}

export const updateProduct = async (req, res) => {}

export const deleteProduct = async (req, res) => {}