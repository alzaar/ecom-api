import Order from '../models/order'
import Product from '../models/product'

const controller = {}

controller.getCurrentOrders = async (req, res) => {
    try {
        const orders = await Order.findOne({ user: req.params.user_id })
        const products = []
        
        if (orders) {
            await Promise.all(orders.currentOrders.map(async (order) => products.push(await Product.findById(order))))
        }

        res.status(200).send({
            message: `OK`,
            data: products,
            errors: false
        })

    } catch (err) {
        res.status(400).send({
            errors: true,
            logError: `${err.reason}`,
            message: `User id in request is incorrect - ${req.params.user_id}`
        })
    }
}

controller.getPreviousOrders = async (req, res) => {
    try {
        const orders = await Order.findOne({ user: req.params.user_id })
        const products = []
        
        if (orders) {
            await Promise.all(orders.previousOrders.map(async (order) => products.push(await Product.findById(order))))
        }

        res.status(200).send({
            'message': 'OK',
            'data': products,
            'errors': false
        })

    } catch (err) {
        res.status(400).send({
            errors: true,
            logError: `${err.reason}`,
            message: `User id in request is incorrect - ${req.params.user_id}`
        })
    }
}

controller.getOrder = async (req, res) => {
    try {
        const orders = await Order.findOne({ user: req.params.user_id })
        const product = []

        if (orders && orders.currentOrders.includes(req.body.product_id)) {
            product.push(await Product.findById(req.body.product_id))    
        }

        res.status(200).send({
            'message': 'OK',
            'data': product,
            'errors': false
        })

    } catch (err) {
        res.status(400).send({
            errors: true,
            logError: `${err.reason}`,
            message: `User id in request is incorrect - ${req.params.user_id}`
        })
    }
}

controller.updatePreviousOrders = async (req, res) => {
    try {

        const orders = await Order.findOne({
            user: req.params.user_id
        })

        if (orders) {
            
            orders.previousOrders.push(req.body.product_id)
            await orders.save()
            const previousOrderProducts =  await Promise.all(orders.previousOrders.map(async (p) => await Product.findById(p._id)))

            res.status(200).send({
                'message': 'OK',
                'data': previousOrderProducts,
                'errors': false
            })

        } else {

            res.status(400).send({
                'message': `Error, user doesn't exist or no such order.`,
                'data': [],
                'errors': false
            })

        }

    } catch (err) {
        res.status(400).send({
            errors: true,
            logError: `${err.reason}`,
            message: `User id in request is incorrect - ${req.params.user_id}`
        })
    }
}

controller.updateCurrentOrders = async (req, res) => {
    try {

        const orders = await Order.findOne({
            user: req.params.user_id
        })

        if (orders) {
            
            orders.currentOrders.push(req.body.product_id)
            await orders.save()
            const currentOrderProducts =  await Promise.all(orders.currentOrders.map(async (p) => await Product.findById(p._id)))

            res.status(200).send({
                'message': 'OK',
                'data': currentOrderProducts,
                'errors': false
            })

        } else {
            
            const newOrder = await new Order({
                user: req.params.user_id,
                currentOrders: [ req.body.product_id ]
            }).save()
            const currentOrderProducts =  await Promise.all(newOrder.currentOrders.map(async (p) => await Product.findById(p._id)))

            res.status(201).send({
                'message': 'OK',
                'data': currentOrderProducts,
                'errors': false
            })

        }

    } catch (err) {
        res.status(400).send({
            errors: true,
            logError: `${err.reason}`,
            message: `User id in request is incorrect - ${req.params.user_id}`
        })
    }
}

controller.deletePreviousOrders = async (req, res) => {
    try {

        const orders = await Order.findOne({
            user: req.params.user_id
        })

        if (orders && orders.previousOrders.includes(req.body.product_id)) {

            orders.previousOrders = orders.previousOrders.filter((product_id) => req.body.product_id !== `${product_id}`)            
            await orders.save()

            res.status(200).send({
                'message': 'OK',
                'data': orders.previousOrders,
                'errors': false
            })

        } else {
            res.status(201).send({
                'message': 'No Such order placed!',
                'data': [],
                'errors': false
            })

        }

    } catch (err) {
        res.status(400).send({
            errors: true,
            logError: `${err.reason}`,
            message: `User id in request is incorrect - ${req.params.user_id}`
        })
    }
}

controller.deleteCurrentOrders = async (req, res) => {
    try {

        const orders = await Order.findOne({
            user: req.params.user_id
        })

        if (orders && orders.currentOrders.includes(req.body.product_id)) {

            orders.currentOrders = orders.currentOrders.filter((product_id) => req.body.product_id !== `${product_id}`)
            await orders.save()

            res.status(200).send({
                'message': 'OK',
                'data': orders.currentOrders,
                'errors': false
            })

        } else {
            res.status(200).send({
                'message': 'No Such order placed!',
                'data': [],
                'errors': false
            })

        }

    } catch (err) {
        res.status(400).send({
            errors: true,
            logError: `${err.reason}`,
            message: `User id in request is incorrect - ${req.params.user_id}`
        })
    }
}

export default controller
