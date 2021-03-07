import Product from '../models/product'

const controller = {}

controller.getAllProducts = (req, res) => {
    return Product.find({}).then((products) =>
        res.status(200).send({
            'message': 'OK',
            'data': products,
            'errors': false
        })
    )
}

controller.getProduct = (req, res) => {
    return Product.findById(req.params.product_id)
        .then((product) => res.status(200).send({
            'data': product,
            'message': 'OK',
            'errors': false
        })
    )
}

controller.createProduct = (req, res) => {
    const newProduct = new Product({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description
    })
    
    return newProduct.save().then(
        (product) => res.status(201).send({
            'message': 'Created',
            'data': product,
            'errors': false
        })
    )
}

controller.updateProduct = async (req, res) => {
    try {
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
        res.status(400).send(err.errors)
    }
}

controller.deleteProduct = (req, res) => {
    return Product.findByIdAndDelete(req.params.product_id)
        .then(() => res.status(200).send({
            'message': 'Deleted',
            'errors': false
        })
    )
}

export default controller
