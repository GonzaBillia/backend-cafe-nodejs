import connection from "../db/connection.js";
import jwt from "jsonwebtoken"
import {config} from "dotenv"
import transporter from "../helpers/mailer.js";
import { SUCCESS_CHANGE_PASSWORD, SUCCESS_FORGOT_PASSWORD, SUCCESS_LOGIN, SUCCESS_OK, SUCCESS_TOKEN_VALID, SUCCESS_UPDATE_STATUS, SUCCESS_UPDATE_USER, SUCCESS_USER_CREATED } from "../constants/messages.constant.js";
import { ERROR_APPROVAL, ERROR_CREATE_USER, ERROR_INVALID_CREDENTIALS, ERROR_NOT_FOUND_EMAIL, ERROR_QUERY, ERROR_SERVER, ERROR_UPDATE_USER, ERROR_USER_EXISTS, ERROR_USER_NOT_FOUND, ERROR_WRONG } from "../constants/errors.constant.js";

config()

export const getUsers = (req, res) => {
    try {
        const q = "SELECT * FROM user WHERE role = 'user'"
        connection.query(q, (err, result) => {
            if(!err) {
                return res.status(200).send({message: SUCCESS_OK, payload: result})
            } else {
                return res.status(500).send({message: ERROR_QUERY, error: err})
            }
        })
        
    } catch (error) {
        return res.status(500).send({message: ERROR_SERVER, error: err})
    }
}

export const getUserById = (req, res) => {}

export const createUser = (req, res) => {}

export const updateUser = (req, res) => {
    let user = req.body
    const query = "UPDATE user SET name = ?, contact_number = ?, email = ? WHERE user_id = ?"
    connection.query(query, [user.name, user.contact_number, user.email, user.user_id], (err, result) => {
        if(!err) {
            if(result.affectedRows > 0) {
                return res.status(200).send({message: SUCCESS_UPDATE_USER, payload: result})
            } else {
                return res.status(404).send({message: ERROR_USER_NOT_FOUND, error: err})
            }
        } else {
            return res.status(500).send({message: ERROR_UPDATE_USER, error: err})
        }
    })
}

export const deleteUser = (req, res) => {}

export const checkToken = (req, res) => {
    return res.status(200).send({message: SUCCESS_TOKEN_VALID})
}

export const patchStatus = (req, res) => {
    let user = req.body
    const query = "UPDATE user SET status = ? WHERE id = ?"
    connection.query(query, [user.status, user.id], (err, result) => {
        if(!err) {
            if(result.affectedRows > 0) {
                return res.status(200).send({message: SUCCESS_UPDATE_STATUS, payload: result})
            } else {
                return res.status(404).send({message: ERROR_USER_NOT_FOUND, error: err})
            }
        } else {
            return res.status(500).send({message: ERROR_UPDATE_USER, error: err})
        }
    })
}

export const signUp = (req, res) => {
    try {
        let newUser = req.body
        const query = "SELECT email,password,role,status FROM user WHERE email=?"
        connection.query(query, [newUser.email], (err, result) => {
            if(!err) {
                if(result.length > 0) {
                    return res.status(400).send({message: ERROR_USER_EXISTS, error: err})
                } else {
                    const query = "INSERT INTO user (name, contact_number,email, password, role, status) VALUES (?,?,?,?, 'user', 'false')"
                    connection.query(query, [newUser.name, newUser.contact_number, newUser.email, newUser.password], (err, result) => {
                        if(!err) {
                            return res.status(200).send({message: SUCCESS_USER_CREATED, payload: result})
                        } else {
                            return res.status(500).send({message: ERROR_CREATE_USER, error: err})
                        }
                    })
                }
            } else {
                return res.status(500).send({message: ERROR_QUERY, error: err})
            }
        })
    } catch (error) {
        return res.status(500).send({message: ERROR_SERVER, error: error})
    }
}

export const signIn = (req, res) => {
    try {
        const user = req.body
        const query = "SELECT email,password,role,status FROM user WHERE email=?"
        connection.query(query, [user.email], (err, result) => {
            if(!err) {
                if(result.length <= 0 || result[0].password != user.password) {
                    return res.status(401).send({message: ERROR_INVALID_CREDENTIALS, error: err})
                } else if (result[0].status === "false") {
                    return res.status(401).send({message: ERROR_APPROVAL, error: err})
                } else if (result[0].password == user.password) {
                    const response = { email: result[0].email, role: result[0].role }
                    const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN,{expiresIn: '8h'})
                    res.status(200).send({message: SUCCESS_LOGIN, token: accessToken})
                } else {
                    return res.status(400).send({message: ERROR_WRONG, error: err})
                }
            } else {
                return res.status(500).send({message: ERROR_QUERY, error: err})
            }
        })
    } catch (error) {
        return res.status(500).send({message: ERROR_SERVER, error: error})
    }
}

export const forgotPassword = (req, res) => {
    try {
        const user = req.body
        const query = "SELECT email,password FROM user WHERE email=?"
        connection.query(query, [user.email], (err, result) => {
            if(!err) {
                if(result.length <= 0) {
                    return res.status(400).send({message: ERROR_NOT_FOUND_EMAIL, error: err})
                } else {
                    let mailOptions = {
                        from: process.env.EMAIL,
                        to: result[0].email,
                        subject: 'Password by Cafe Management System',
                        html: `<h1>Hello ${result[0].email}</h1>
                        <p>Your password is ${result[0].password}</p>`
                    }
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            return res.status(500).send({message: ERROR_WRONG, error: error})
                        } else {
                            return res.status(200).send({message: SUCCESS_FORGOT_PASSWORD})
                        }
                    })
                }
            } else {
                return res.status(500).send({message: ERROR_QUERY, error: err})
            }
        })
    } catch (error) {
        return res.status(500).send({message: ERROR_SERVER, error: error})
    }
}

export const changePassword = (req, res) => {
    let user = req.body
    const email = res.req.user.email
    let query = "SELECT * FROM  user WHERE email=? and password=?"
    connection.query(query, [email, user.oldPassword], (err, result) => {
        if(!err){
            if(result.length <= 0) {
                return res.status(401).send({message: ERROR_INVALID_CREDENTIALS, error: err})
            } else if (result[0].password == user.oldPassword) {
                query = "UPDATE user SET password=? WHERE email=?"
                connection.query(query, [user.newPassword, email], (err, result) => {
                    if(!err) {
                        return res.status(200).send({message: SUCCESS_CHANGE_PASSWORD, payload: result})
                    } else {
                        return res.status(500).send({message: ERROR_QUERY, error: err})
                    }
                })
            } else {
                return res.status(400).send({message: ERROR_WRONG, error: err})
            }
        } else {
            return res.status(500).send({message: ERROR_QUERY, error: err})
        }
    })
}