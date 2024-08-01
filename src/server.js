import express from "express"
import cors from "cors"
import connection from "./db/connection.js"

import UserRouter from "./routes/user.routes.js"
import CategoryRouter from "./routes/category.routes.js"
import ProductRouter from "./routes/product.routes.js"
import BillRouter from "./routes/bill.routes.js"

const app = express()

//Basics
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Routes
app.use("/user", UserRouter)
app.use("/category", CategoryRouter)
app.use("/product", ProductRouter)
app.use("/bill", BillRouter)

connection.connect((err) => {
    if(!err) console.log("Conectado a la base de datos")
    else console.log(err)
})

app.listen(3000, () => {
    console.log("Ejecutandose en http://localhost:3000")
})
