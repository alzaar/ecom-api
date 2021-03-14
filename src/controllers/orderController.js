import Order from '../models/order'
import mongoose from 'mongoose'

const controller = {}

controller.getOrders = async (req, res) => {
    try {
        const orders = await Order.findOne({ user: req.params.user_id })

        res.status(200).send({
            'message': 'OK',
            'data': orders,
            'errors': false
        })

    } catch (err) {
        console.error(err)
        res.status(400).send(err.errors)
    }
}

controller.updatePreviousOrders = async (req, res) => {
    res.status(200).send({
        message: req.params.product_id,
        errors: false
    })
}

controller.updateCurrentOrders = async (req, res) => {
    try {

        const orders = await Order.findOne({
            user: req.params.user_id
        })

        if (orders) {
            
            orders.currentOrders.push(req.body.product_id)
            await orders.save()

            res.status(200).send({
                'message': 'OK',
                'data': orders,
                'errors': false
            })

        } else {
            
            const newOrder = await new Order({
                user: req.params.user_id,
                currentOrders: [ req.body.product_id ]
            }).save()

            res.status(201).send({
                'message': 'OK',
                'data': newOrder,
                'errors': false
            })

        }

    } catch (err) {
        console.error(err)
        res.status(400).send(err.errors)
    }
}

controller.deletePreviousOrders = async (req, res) => {

}

controller.deleteCurrentOrders = async (req, res) => {

}

export default controller