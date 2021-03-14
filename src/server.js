import express from 'express'
import dotEnv from 'dotenv'
import mongoose from 'mongoose'
// import pathfinderUI from 'pathfinder-ui'
// Middleware

// Config Setup
dotEnv.config()

// Controllers
import productController from './controllers/productController'
import userController from './controllers/userController'
import orderController from './controllers/orderController'

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
app.get('/_', (req, res) => res.status(200).send({
    message: 'Route_Paths',
    errors: false,
    products: [
        'root_path/products: Get -- all products',
        'root_path/products: Post -- create Product',
        'root_path/products/${id}: Get -- Get Product based on Id',
        'root_path/products/${id}: Put -- Update Product based on Id',
        'root_path/products/${id}: Delete -- Delete Product based on Id',
    ],
    users: [
        'root_path/users: Get -- all Users',
        'root_path/users: Post -- create User',
        'root_path/users/${id}: Get -- Get User based on Id',
        'root_path/users/${id}: Put -- Update User based on Id',
        'root_path/users/${id}: Delete -- Delete User based on Id',
    ]
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

// Order Controller
app.route('/orders/:user_id')
    .get(orderController.getOrders)
    .put(orderController.updateCurrentOrders)

// Start server and listen on PORT mentioned
app.listen(process.env.PORT, () => console.log(
    `Listening on ${process.env.PORT}`
))

export default app
