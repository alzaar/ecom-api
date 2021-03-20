import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../../server'
import Order from '../../models/order'
import chaiDateString from 'chai-date-string'
import User from '../../models/user'
import Product from '../../models/product'

// Enable Chai Config when testing
chai.should()
chai.use(chaiDateString)
chai.use(chaiHttp)

// TODO
// ADD MORGAN LOGS

describe('Orders', (done) => {
    beforeEach((done) => {
        Order.deleteMany({}, (err) => {
            User.deleteMany({}, (err) => {
                done()
            })
        })        
    })

    // GET All Current Orders
    describe('/GET All Current Orders', () => {
        it('it should get all current orders of user', (done) => {
            new User({
                username: 'test_user',
                email: 'test@email.com',
                password: 'test123',
            }).save().then((u) => {
                new Order({
                    user: u._id
                })
                .save().then((o) => {
                    chai.request(server)
                    .get(`/orders/${o.user}`)
                    .end((err, res) => {
                        res.should.have.status(200)
                        res.body.should.be.a('object')
                        res.body.should.have.property('errors').eql(false)
                        res.body.should.have.property('data').be.a('array')
                        res.body.data.should.have.length(0)
                        done()
                    })
                })
            })
        })
    })

    // GET Current Order
    describe('/GET Current Order', () => {
        it('it should get current order of a user', (done) => {
            new User({
                username: 'test_user',
                email: 'test@email.com',
                password: 'test123',
            }).save().then((u) => {
                new Product({
                    "name": "PC",
                    "description": "some",
                    "price": 400
                }).save().then((p) => {
                    new Order({
                        user: u._id,
                        currentOrders: [p._id]
                    }).save().then((o) => {
                        chai.request(server)
                        .get(`/order/${o.user}`)
                        .send({ product_id: p._id })
                        .end((err, res) => {
                            res.should.have.status(200)
                            res.body.should.be.a('object')
                            res.body.should.have.property('errors').eql(false)
                            res.body.should.have.property('message').eql('OK')
                            res.body.should.have.property('data').be.a('array')
                            res.body.data.should.have.length(1)
                            res.body.data[0].should.have.property('_id').eql(p._id.toString())
                            done()
                        })
                    }) 
                })
            })
        })
    })

    // GET Previous Orders
    describe('/GET Previous Orders', () => {
        it('it should get previous orders of a user', (done) => {
            new User({
                username: 'test_user',
                email: 'test@email.com',
                password: 'test123',
            }).save().then((u) => {
                new Product({
                    "name": "PC",
                    "description": "some",
                    "price": 400
                }).save().then((p) => {
                    new Order({
                        user: u._id,
                        previousOrders: [p._id]
                    }).save().then((o) => {
                        chai.request(server)
                        .get(`/past-orders/${o.user}`)
                        .send({ product_id: p._id })
                        .end((err, res) => {
                            res.should.have.status(200)
                            res.body.should.be.a('object')
                            res.body.should.have.property('errors').eql(false)
                            res.body.should.have.property('message').eql('OK')
                            res.body.should.have.property('data').be.a('array')
                            res.body.data.should.have.length(1)
                            res.body.data[0].should.have.property('_id').eql(p._id.toString())
                            done()
                        })
                    }) 
                })
            })
        })
    })

    // PUT Update Previous Orders
    describe('/PUT Previous Orders', () => {
        it('it should update previous orders of a user', (done) => {
            new User({
                username: 'test_user',
                email: 'test@email.com',
                password: 'test123',
            }).save().then((u) => {
                new Product({
                    "name": "PC",
                    "description": "some",
                    "price": 400
                }).save().then((p) => {
                    new Order({
                        user: u._id,
                    }).save().then((o) => {
                        chai.request(server)
                        .put(`/past-orders/${o.user}`)
                        .send({ product_id: p._id })
                        .end((err, res) => {
                            res.should.have.status(200)
                            res.body.should.be.a('object')
                            res.body.should.have.property('errors').eql(false)
                            res.body.should.have.property('message').eql('OK')
                            res.body.should.have.property('data').be.a('array')
                            res.body.data.should.have.length(1)
                            res.body.data[0].should.have.property('_id').eql(p._id.toString())
                            done()
                        })
                    }) 
                })
            })
        })
    })

    // PUT Update Current Orders
    describe('/PUT Current Orders', () => {
        it('it should update current orders of a user', (done) => {
            new User({
                username: 'test_user',
                email: 'test@email.com',
                password: 'test123',
            }).save().then((u) => {
                new Product({
                    "name": "PC",
                    "description": "some",
                    "price": 400
                }).save().then((p) => {
                    new Order({
                        user: u._id,
                    }).save().then((o) => {
                        chai.request(server)
                        .put(`/orders/${o.user}`)
                        .send({ product_id: p._id })
                        .end((err, res) => {
                            res.should.have.status(200)
                            res.body.should.be.a('object')
                            res.body.should.have.property('errors').eql(false)
                            res.body.should.have.property('message').eql('OK')
                            res.body.should.have.property('data').be.a('array')
                            res.body.data.should.have.length(1)
                            res.body.data[0].should.have.property('_id').eql(p._id.toString())
                            done()
                        })
                    }) 
                })
            })
        })
    })

    // POST Create Current Orders
    describe('/POST Current Orders', () => {
        it('it should create current orders of a user', (done) => {
            new User({
                username: 'test_user',
                email: 'test@email.com',
                password: 'test123',
            }).save().then((u) => {
                new Product({
                    "name": "PC",
                    "description": "some",
                    "price": 400
                }).save().then((p) => {
                    new Order({
                        user: u._id,
                    }).save().then((o) => {
                        chai.request(server)
                        .put(`/orders/${o.user}`)
                        .send({ product_id: p._id })
                        .end((err, res) => {
                            res.should.have.status(200)
                            res.body.should.be.a('object')
                            res.body.should.have.property('errors').eql(false)
                            res.body.should.have.property('message').eql('OK')
                            res.body.should.have.property('data').be.a('array')
                            res.body.data.should.have.length(1)
                            res.body.data[0].should.have.property('_id').eql(p._id.toString())
                            done()
                        })  
                    })
                })
            })
        })
    })

    // DELETE Delete Current Orders
    describe('/Delete Current Orders', () => {
        it('it should Delete current orders of a user', (done) => {
            new User({
                username: 'test_user',
                email: 'test@email.com',
                password: 'test123',
            }).save().then((u) => {
                new Product({
                    "name": "PC",
                    "description": "some",
                    "price": 400
                }).save().then((p) => {
                    new Order({
                        user: u._id,
                        currentOrders: [p._id]
                    }).save().then((o) => {
                        chai.request(server)
                        .delete(`/orders/${u._id}`)
                        .send({ product_id: p._id })
                        .end((err, res) => {
                            res.should.have.status(200)
                            res.body.should.be.a('object')
                            res.body.should.have.property('errors').eql(false)
                            res.body.should.have.property('message').eql('OK')
                            res.body.should.have.property('data').be.a('array')
                            res.body.data.should.have.length(0)
                            done()
                        })
                    })
                })
            })
        })
    })

    // DELETE Delete Previous Orders
    describe('/Delete Previous Orders', () => {
        it('it should Delete previous orders of a user', (done) => {
            new User({
                username: 'test_user',
                email: 'test@email.com',
                password: 'test123',
            }).save().then((u) => {
                new Product({
                    "name": "PC",
                    "description": "some",
                    "price": 400
                }).save().then((p) => {
                    new Order({
                        user: u._id,
                        previousOrders: [p._id]
                    }).save().then((o) => {
                        chai.request(server)
                        .delete(`/past-orders/${o.user}`)
                        .send({ product_id: p._id })
                        .end((err, res) => {
                            res.should.have.status(200)
                            res.body.should.be.a('object')
                            res.body.should.have.property('errors').eql(false)
                            res.body.should.have.property('message').eql('OK')
                            res.body.should.have.property('data').be.a('array')
                            res.body.data.should.have.length(0)
                            done()
                        })
                    })
                })
            })
        })
    })
})