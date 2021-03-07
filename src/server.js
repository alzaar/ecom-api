import express from 'express'
import dotEnv from 'dotenv'
import mongoose from 'mongoose'

// Middleware

// Config Setup
dotEnv.config()

// Controllers
import productController from './controllers/productController'
import userController from './controllers/userController'

// App initialization
const app = express()

// Middleware Setup
app.use(express.json())

// DB Setup
mongoose.connect(`mongodb://localhost/e_commerce_${process.env.NODE_ENV}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true  
})
    .then(() => console.log('Connected to DB'))
    .catch((error) => console.log(`ERROR Connecting with DB: \n${error}`))

// Route setup -- Root path
app.get('/', (req, res) => res.status(200).send({
    'message': 'Route_Path'
}))

// Product Controller Routes
app.route('/products')
    .get(productController.getAllProducts)
    .post(productController.createProduct)

app.route('/products/:product_id')
    .get(productController.getProduct)
    .put(productController.updateProduct)
    .delete(productController.deleteProduct)

// User Controller
app.route('/users')
    .get(userController.getAllUsers)
    .post(userController.createUser)

app.route('/users/:user_id')
    .get(userController.getUser)
    .put(userController.updateUser)
    .delete(userController.deleteUser)


// Start server and listen on PORT mentioned
app.listen(process.env.PORT, () => console.log(
    `Listening on ${process.env.PORT}`
))

export default app
