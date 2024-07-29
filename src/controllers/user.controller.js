import { query } from "express";
import connection from "../db/connection.js";
import jwt from "jsonwebtoken"
import {config} from "dotenv"
import nodemailer from "nodemailer"

config()

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

export const getUsers = (req, res) => {
    try {
        const q = "SELECT * FROM user"
        connection.query(q, (err, result) => {
            if(!err) {
                return res.status(200).send(result)
            } else {
                return res.status(500).send(err)
            }
        })
        
    } catch (error) {
        
    }
}

export const getUserById = (req, res) => {}

export const createUser = (req, res) => {}

export const updateUser = (req, res) => {}

export const deleteUser = (req, res) => {}

export const signUp = (req, res) => {
    try {
        let newUser = req.body
        const query = "SELECT email,password,role,status FROM user WHERE email=?"
        connection.query(query, [newUser.email], (err, result) => {
            if(!err) {
                if(result.length > 0) {
                    return res.status(400).send(["Email already exists"])
                } else {
                    const query = "INSERT INTO user (name, contact_number,email, password, role, status) VALUES (?,?,?,?, 'user', 'false')"
                    connection.query(query, [newUser.name, newUser.contact_number, newUser.email, newUser.password], (err, result) => {
                        if(!err) {
                            return res.status(200).send({message: "User Created!", payload: result})
                        } else {
                            return res.status(500).send({message: "Error creating user", error: err})
                        }
                    })
                }
            } else {
                return res.status(500).send({message: "Error on query connection", error: err})
            }
        })
    } catch (error) {
        return res.status(500).send({message: "Error occurred", error: error})
    }
}

export const signIn = (req, res) => {
    try {
        const user = req.body
        const query = "SELECT email,password,role,status FROM user WHERE email=?"
        connection.query(query, [user.email], (err, result) => {
            if(!err) {
                if(result.length <= 0 || result[0].password != user.password) {
                    return res.status(401).send({message: "Invalid credentials", error: err})
                } else if (result[0].status === "false") {
                    return res.status(401).send({message: "Wait for Admin Approval", error: err})
                } else if (result[0].password == user.password) {
                    const response = { email: result[0].email, role: result[0].role }
                    const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN,{expiresIn: '8h'})
                    res.status(200).send({token: accessToken})
                } else {
                    return res.status(400).send({message: "Something went wrong. Please try again later", error: err})
                }
            } else {
                return res.status(500).send({message: "Error on query connection", error: err})
            }
        })
    } catch (error) {
        return res.status(500).send({message: "Error occurred", error: error})
    }
}

export const forgotPassword = (req, res) => {
    try {
        const user = req.body
        const query = "SELECT email,password FROM user WHERE email=?"
        connection.query(query, [user.email], (err, result) => {
            if(!err) {
                if(result.length <= 0) {
                    return res.status(400).send({message: "Email not found", error: err})
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
                            return res.status(500).send({message: "Mailing Is disabled for now", error: error})
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    })
                    return res.status(200).send({message: "Password sent successfully to your email"})
                }
            } else {
                return res.status(500).send({message: "Error on query connection", error: err})
            }
        })
    } catch (error) {
        return res.status(500).send({message: "Error occurred", error: error})
    }
}