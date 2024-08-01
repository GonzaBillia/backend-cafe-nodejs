import { ERROR_QUERY } from "../constants/errors.constant.js";
import { SUCCESS_GET_ALL } from "../constants/messages.constant.js";
import connection from "../db/connection.js";

export const getDetails = (req, res) => {
    let categoryCount;
    let productCount;
    let billCount;
    let queryCategory = 'SELECT count(id) as categoryCount FROM category'
    connection.query(queryCategory, (err, result) => {
        if (!err) {
            categoryCount = result[0].categoryCount
        } else {
            return res.status(500).send({message: ERROR_QUERY, error: err})
        }
    })

    let queryProduct = 'SELECT count(id) as productCount FROM product'
    connection.query(queryProduct, (err, result) => {
        if (!err) {
            productCount = result[0].productCount
        } else {
            return res.status(500).send({message: ERROR_QUERY, error: err})
        }
    })

    let queryBill = 'SELECT count(id) as billCount FROM bill'
    connection.query(queryBill, (err, result) => {
        if (!err) {
            billCount = result[0].billCount
            return res.status(200).send({message: SUCCESS_GET_ALL, payload: {categoryCount, productCount, billCount}})
        } else {
            return res.status(500).send({message: ERROR_QUERY, error: err})
        }
    })
}