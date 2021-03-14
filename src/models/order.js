import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const Order = mongoose.model('Order', new Schema({
        date: { type: Date, default: Date.now },
        user: { type: ObjectId, ref: 'User', required: true },
        previousOrders: [{
            type: ObjectId, ref: 'Product' // default is []
        }],
        currentOrders: [{
            type: ObjectId, ref: 'Product' // default is []
        }]
    })
)

export default Order
