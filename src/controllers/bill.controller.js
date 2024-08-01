import { SUCCESS_DELETE_DOCUMENT, SUCCESS_GENERATE_REPORT, SUCCESS_GET_ALL_DOCUMENT } from "../constants/messages.constant.js";
import { ERROR_DELETE_DOCUMENT, ERROR_GENERATE_REPORT, ERROR_QUERY } from "../constants/errors.constant.js";
import connection from "../db/connection.js";
import * as uuid from "uuid";
import ejs from "ejs"
import pdf from "html-pdf"
import path from "path"
import fs from "fs"
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getBills = (req, res) => {
    let query = 'SELECT * FROM bill'
    connection.query(query, (err, result) => {
        if (!err) {
            return res.status(200).send({message: SUCCESS_GET_ALL_DOCUMENT, payload: result})
        } else {
            return res.status(500).send({message: ERROR_QUERY, error: err})
        }
    })
}

export const generateReport = (req, res) => {
    const generateUuid = uuid.v1()
    const orderDetails = req.body
    let productDetailsReport = JSON.parse(orderDetails.product_details)

    let query = 'INSERT INTO bill (name,uuid,email,contact_number,payment_method,total,product_details,created_by) VALUES (?,?,?,?,?,?,?,?)'
    connection.query(query, [orderDetails.name, generateUuid, orderDetails.email, orderDetails.contact_number, orderDetails.payment_method, orderDetails.total, orderDetails.product_details, res.req.user.email], (err, result) => {
        if(!err){
            ejs.renderFile(path.join(__dirname,'../reports/model/report.ejs'), {product_details: productDetailsReport, name: orderDetails.name, email: orderDetails.email, contact_number: orderDetails.contact_number, payment_method: orderDetails.payment_method, total: orderDetails.total}, (err, data) => {
                if(err){
                    return res.status(500).send({message: ERROR_GENERATE_REPORT , error: err})
                } else{
                    pdf.create(data,{ childProcessOptions: { env: { OPENSSL_CONF: '/dev/null'}}}).toFile('./reports/'+generateUuid+'.pdf', (err, data) => {
                        if(err){
                            console.log(err);
                            return res.status(500).send({message: ERROR_GENERATE_REPORT , error: err})
                        } else{
                            return res.status(200).send({message: SUCCESS_GENERATE_REPORT, payload: generateUuid+".pdf"})
                        }
                    })
                }
            })
        } else {
            return res.status(500).send({message: ERROR_QUERY, error: err})
        }
    })
}

export const getPdf = (req, res) => {
    const orderDetails = req.body
    const pdfPath = './reports/'+orderDetails.uuid+'.pdf'
    if(fs.existsSync(pdfPath)){
        res.contentType('application/pdf')
        fs.createReadStream(pdfPath).pipe(res)
    } else{
        let productDetailsReport = JSON.parse(orderDetails.product_details)
        ejs.renderFile(path.join(__dirname,'../reports/model/report.ejs'), {product_details: productDetailsReport, name: orderDetails.name, email: orderDetails.email, contact_number: orderDetails.contact_number, payment_method: orderDetails.payment_method, total: orderDetails.total}, (err, data) => {
            if(err){
                return res.status(500).send({message: ERROR_GENERATE_REPORT , error: err})
            } else{
                pdf.create(data,{ childProcessOptions: { env: { OPENSSL_CONF: '/dev/null'}}}).toFile('./reports/'+orderDetails.uuid+'.pdf', (err, data) => {
                    if(err){
                        console.log(err);
                        return res.status(500).send({message: ERROR_GENERATE_REPORT , error: err})
                    } else{
                        res.contentType('application/pdf')
                        fs.createReadStream(pdfPath).pipe(res)
                    }
                })
            }
        })
    }
}

export const deleteBill = (req, res) => {
    let id = req.params.id
    let query = 'DELETE FROM bill WHERE id = ?'
    connection.query(query, [id], (err, result) => {
        if (!err) {
            if(result.affectedRows == 0){
                return res.status(404).send({message: ERROR_DOCUMENT_NOT_FOUND, error: err})
            } else {
                return res.status(200).send({message: SUCCESS_DELETE_DOCUMENT, payload: result})
            }
        } else {
            return res.status(500).send({message: ERROR_DELETE_DOCUMENT, error: err})
        }
    })
}