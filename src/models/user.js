import mongoose from 'mongoose'
import { EMAIL_REGEX } from '../config/constants'

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const User = mongoose.model('User', new Schema({
        username: { type: String, required: true, minLength: 2 },
        password: { type: String, required: true, minLength: 5, },
        email: {
            type: String, minLength: 3, 
            required: true,
            unique: true,
            validate: { validator: async (email) => EMAIL_REGEX.test(String(email).toLowerCase()) },
            message: (props) => 'Email validation failed'
        },
        date: { type: Date, default: Date.now },
        previousOrders: [{
            type: ObjectId, ref: 'Product' // default is []
        }],
        currentOrders: [{
            type: ObjectId, ref: 'Product' // default is []
        }]
    })
)

export default User
