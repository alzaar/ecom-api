import User from '../models/user'

const controller = {}

controller.createUser = async (req, res) => {
    try {
        const newUser = await new User({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        }).save()

        res.status(201).send({
            'message': 'Created',
            'data': newUser,
            'errors': false
        })
    } catch (err) {
        res.status(400).send(err.errors)
    }
}

controller.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.user_id)

        res.status(200).send({
            'message': 'OK',
            'data': user,
            'errors': false
        })
    } catch (err) {
        res.status(400).send(err.errors)
    }
}

controller.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({})

        res.status(200).send({
            'message': 'OK',
            'data': users,
            'errors': false
        })
    } catch (err) {
        res.status(400).send(err.errors)
    }
}

controller.updateUser = async (req, res) => {
    try {
        await User.findByIdAndUpdate(
            req.params.user_id,
            {
                $set: {
                    username: req.body.username,
                    password: req.body.password,
                    email: req.body.email
                }
            }
        )

        const updateUser = await User.findById(req.params.user_id)

        res.status(200).send({
            'message': 'Updated',
            'data': updateUser,
            'errors': false
        })
    } catch (err) {
        res.status(400).send(err.errors)
    }
}

controller.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.user_id)

        res.status(200).send({
            'message': 'Deleted',
            'errors': false
        })
    } catch (err) {
        res.status(400).send(err.errors)
    }
}

export default controller