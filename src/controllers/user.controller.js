import { query } from "express";
import connection from "../db/connection.js";

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
                    const query = "INSERT INTO user (name, contact_number,email, password, role, status) VALUES (?,?,?,?, 'false', 'user')"
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

export const signIn = (req, res) => {}