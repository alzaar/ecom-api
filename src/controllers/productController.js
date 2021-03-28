import Product from '../models/product'

const controller = {}

controller.getAllProducts = (req, res) => {
    try {
        Product.find({}).then((products) =>
            res.status(200).send({
                'message': 'OK',
                'data': products,
                'errors': false
            })
        )
    } catch (err) {
        res.status(400).send({
            errors: true,
            logError: `${err}`,
            details: err.errors,
        })
    }
}

controller.getProduct = async (req, res) => {
    try {
            await Product.findById(req.params.product_id)
            .then((product) => res.status(200).send({
                'data': product,
                'message': 'OK',
                'errors': false
            })
        )
    } catch(err) {
        res.status(400).send({
            errors: true,
            logError: `${err}`,
            details: {
                messageFormat: err.messageFormat,
                kind: err.kind,
                value: err.value,
                reason: `${err.reason}`,
            },
        })
    }
}

controller.createProduct = async (req, res) => {
    // Modify to include User id
    try {
        const product = await new Product({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            user: req.body.user,
        }).save()
        
        // await newProduct.save()
        res.status(201).send({
            'message': 'Created',
            'data': product,
            'errors': false
        })
    } catch (err) {
        res.status(400).send({
            errors: true,
            logError: `${err}`,
            details: err.errors,
        })
    }
}

controller.updateProduct = async (req, res) => {
    try {
        if (!(req.body.name) || !(req.body.price) || !(req.body.description)) {
            throw ({
                logError: 'Invalid request body',
                messageFormat: 'JSON',
                kind: 'Request body of JSON type needed',
                value: 'NA',
                reason: 'Missing price, name or description fields'
            })
        }
        await Product.findByIdAndUpdate(
            req.params.product_id,
            {
                $set: {
                    name: req.body.name,
                    price: req.body.price,
                    description: req.body.description
                }
            }
        )
 
        const updateProduct = await Product.findById(req.params.product_id)

        res.status(200).send({
            'message': 'Updated',
            'data': updateProduct,
            'errors': false
        })

    } catch (err) {
        res.status(400).send({
            errors: true,
            logError: err.logError ? err.logError : `${err}`,
            details: {
                messageFormat: err.messageFormat,
                kind: err.kind,
                value: err.value,
                reason: `${err.reason}`,
            },
        })
    }
}

controller.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.product_id)
        res.status(200).send({
            'message': 'Deleted',
            'errors': false
        })
    } catch (err) {
        res.status(400).send({
            errors: true,
            logError: `${err}`,
            details: {
                messageFormat: err.messageFormat,
                kind: err.kind,
                value: err.value,
                reason: `${err.reason}`,
            },
        })
    }
}

export default controller
