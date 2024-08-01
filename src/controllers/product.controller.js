import { ERROR_CREATE_PRODUCT, ERROR_DELETE_PRODUCT, ERROR_PRODUCT_NOT_FOUND, ERROR_QUERY, ERROR_UPDATE_PRODUCT } from "../constants/errors.constant.js";
import { SUCCESS_GET_ALL, SUCCESS_PRODUCT_CREATED, SUCCESS_PRODUCT_DELETED, SUCCESS_PRODUCT_UPDATED } from "../constants/messages.constant.js";
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

export const getProduct = (req, res) => {
    let id = req.params.id
    let query = 'SELECT p.id, p.title, p.description, p.price/100, p.code, p.stock, p.status, p.thumbnail, c.name AS category FROM product p INNER JOIN category c ON p.category_id = c.id WHERE p.id = ?'
    connection.query(query, [id], (err, result) => {
        if (!err) {
            return res.status(200).send({message: SUCCESS_GET_ALL, payload: result})
        } else {
            return res.status(500).send({message: ERROR_QUERY, error: err})
        }
    })
}

export const getByCategory = (req, res) => {

    let id = req.params.id
    let query = 'SELECT id, title FROM product WHERE category_id = ? AND status = "true"'
    connection.query(query, [id], (err, result) => {
        if(!err){
            return res.status(200).send({message: SUCCESS_GET_ALL, payload: result})
        } else {
            return res.status(500).send({message: ERROR_QUERY, error: err})
        }
    })
}

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

export const updateProduct = (req, res) => {
    let id = req.params.id
    let product = req.body
    let query = 'UPDATE product SET title = ?, description = ?, price = ?, category_id = ?, code = ?, stock = ?, thumbnail = ? WHERE id = ?'
    connection.query(query, [product.title, product.description, product.price, product.category_id, product.code, product.stock, product.thumbnail, id], (err, result) => {
        if (!err) {
            if(result.affectedRows == 0){
                return res.status(404).send({message: ERROR_PRODUCT_NOT_FOUND, error: err})
            } else {
                return res.status(200).send({message: SUCCESS_PRODUCT_UPDATED, payload: result})
            }
        } else {
            return res.status(500).send({message: ERROR_UPDATE_PRODUCT, error: err})
        }
    })
}

export const updateStatus = (req, res) => {
    let id = req.params.id
    let product = req.body
    let query = 'UPDATE product SET status = ? WHERE id = ?'
    connection.query(query, [product.status, id], (err, result) => {
        if (!err) {
            if(result.affectedRows == 0){
                return res.status(404).send({message: ERROR_PRODUCT_NOT_FOUND, error: err})
            } else {
                return res.status(200).send({message: SUCCESS_PRODUCT_UPDATED, payload: result})
            }
        } else {
            return res.status(500).send({message: ERROR_UPDATE_PRODUCT, error: err})
        }
    })
}

export const deleteProduct = async (req, res) => {
    let id = req.params.id
    let query = 'DELETE FROM product WHERE id = ?'
    connection.query(query, [id], (err, result) => {
        if (!err) {
            if(result.affectedRows == 0){
                return res.status(404).send({message: ERROR_PRODUCT_NOT_FOUND, error: err})
            } else {
                return res.status(200).send({message: SUCCESS_PRODUCT_DELETED, payload: result})
            }
        } else {
            return res.status(500).send({message: ERROR_DELETE_PRODUCT, error: err})
        }
    })
}