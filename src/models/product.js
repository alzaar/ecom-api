import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const Product = mongoose.model('Product', new Schema({
        name: { type: String, required: true },
        price: { type: Number, min: 0, required: true, default: 0 },
        description: { type: String, required: true },
        date: { type: Date, default: Date.now },
        user: { type: ObjectId, ref: 'User' }
    })
)

export default Product
