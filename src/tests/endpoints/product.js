import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../../server'
import Product from '../../models/product'
import User from '../../models/user'
import chaiDateString from 'chai-date-string'
import { dummyUser, dummyProduct } from '../configData'
// Enable Chai Config when testing
chai.should()
const expect = chai.expect
chai.use(chaiDateString)
chai.use(chaiHttp)

//  ADD MORGAN LOGS and change env to test for this

describe('Products', (done) => {
    beforeEach((done) => {
        Product.deleteMany({}, (err) => {
            User.deleteMany({}, (err) => {
                done()
            })
        })        
    })

    // Create a product
    describe('/POST Product', () => {
        it('it should not create a product without product field details', (done) => {
            new User(dummyUser).save().then((u) => {
                dummyProduct.user = u._id
                chai.request(server)
                .post(`/products`)
                .send(dummyProduct)
                .end((err, res) => {
                    res.should.have.status(201)
                    res.body.should.be.a('object')
                    res.body.should.have.property('errors').eql(false)
                    res.body.should.have.property('data')
                    res.body.data.should.be.a('object')
                    // Check product details
                    res.body.data.should.have.property('name').to.be.a('string')
                    res.body.data.should.have.property('_id').to.be.a('string')
                    res.body.data.should.have.property('price').to.be.a('number')
                    res.body.data.should.have.property('description').to.be.a('string')
                    expect(res.body.data.date).to.be.a.dateString()
                    done()
                })
            })
        })
        // Test error in request endpoint
        it('it should fail when request has missing product details', (done) => {
            chai.request(server)
                .post(`/products`)
                .send({})
                .end((err, res) => {
                    res.should.have.status(400)
                    res.body.should.be.a('object')
                    res.body.should.have.property('errors').eql(true)
                    res.body.should.have.property('errors').eql(true)
                    res.body.should.have.property('logError').to.be.a('string')
                    res.body.should.have.property('details').should.be.a('object')
                    res.body.details.should.be.a('object')
                    expect(Object.keys(res.body.details).length).eql(3)
                    res.body.details.should.have.property('name')
                    res.body.details.should.have.property('description')
                    res.body.details.should.have.property('user')
                    // Name
                    res.body.details.name.should.have.property('name')
                    res.body.details.name.should.have.property('message')
                    res.body.details.name.should.have.property('properties')
                    res.body.details.name.should.have.property('kind')
                    res.body.details.name.should.have.property('path')
                    expect(Object.keys(res.body.details.name).length).eql(5)
                    // Description 
                    res.body.details.description.should.have.property('name')
                    res.body.details.description.should.have.property('message')
                    res.body.details.description.should.have.property('properties')
                    res.body.details.description.should.have.property('kind')
                    res.body.details.description.should.have.property('path')
                    expect(Object.keys(res.body.details.description).length).eql(5)
                    // User
                    res.body.details.user.should.have.property('name')
                    res.body.details.user.should.have.property('message')
                    res.body.details.user.should.have.property('properties')
                    res.body.details.user.should.have.property('kind')
                    res.body.details.user.should.have.property('path')
                    expect(Object.keys(res.body.details.user).length).eql(5)
                    done()
                })
        })
    })

    // GET for all products - Test
    describe('/GET products', () => {
        it('it should get all products', (done) => {
            chai.request(server)
            .get('/products')
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.have.property('message').eql('OK')
                res.body.data.should.be.a('array')
                res.body.data.length.should.be.eql(0)
                res.body.should.have.property('errors').eql(false)
                done()
            })
        })
        // Test error handling
        it('it should handle errors when jwt token is missing', (done)  => {
            done()
            //TODO -- Add code here
        })
    })

     // Delete a Product
     describe('/DELETE products', () => {
        it('it should check delete functionality for a product', (done) => {
            new User(dummyUser).save().then((u) => {
                dummyProduct.user = u._id
                new Product(dummyProduct).save().then((p) => {
                    chai.request(server)
                    .delete(`/products/${p._id}`)
                    .end((err, res) => {
                        res.should.have.status(200)
                        res.body.should.be.a('object')
                        res.body.should.have.property('errors').eql(false)
                        res.body.should.have.a.property('message').eql('Deleted')
                        done()
                    })
                })
            })
        })
        // Test error handling
        it('it should handle error when incorrect product id is present in the url', (done) => {
            chai.request(server)
            .delete(`/products/gibberish`)
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.be.a('object')
                res.body.should.have.property('errors').eql(true)
                res.body.should.have.a.property('logError').eql('CastError: Cast to ObjectId failed for value "gibberish" at path "_id" for model "Product"')
                res.body.should.have.a.property('details')
                expect(Object.keys(res.body.details).length).eql(3)
                res.body.details.should.have.a.property('kind')
                res.body.details.should.have.a.property('value')
                res.body.details.should.have.a.property('reason')
                done()
            })
        })
    })

    // GET Product based on id
    describe('/GET{id} products', () => {
        it('it should get product based on id', (done) => {
            new Product(dummyProduct).save().then((p) => {
                chai.request(server)
                .get(`/products/${p._id}`)
                .send(p)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('errors').eql(false)
                    res.body.should.have.property('data')
                    res.body.data.should.be.a('object')
                    // Check product details
                    res.body.data.should.have.property('name').to.be.a('string')
                    res.body.data.should.have.property('_id').to.be.a('string')
                    res.body.data.should.have.property('price').to.be.a('number')
                    res.body.data.should.have.property('description').to.be.a('string')
                    expect(res.body.data.date).to.be.a.dateString()
                    res.body.data.should.have.property('_id').eql(p.id)

                    done()
                })
            })
        })
         // Test error handling
         it('it should handle error when incorrect product id is present in the url', (done) => {
            chai.request(server)
            .get(`/products/gibberish`)
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.be.a('object')
                res.body.should.have.property('errors').eql(true)
                res.body.should.have.a.property('logError').eql('CastError: Cast to ObjectId failed for value "gibberish" at path "_id" for model "Product"')
                res.body.should.have.a.property('details')
                expect(Object.keys(res.body.details).length).eql(3)
                res.body.details.should.have.a.property('kind')
                res.body.details.should.have.a.property('value')
                res.body.details.should.have.a.property('reason')
                done()
            })
        })
    })

    // Update a Product
    describe('PUT/:id Product', () => {
        it('it should UPDATE a product given the id', (done) => {
            new User(dummyUser).save().then((u) => {
                dummyProduct.user = u._id
                new Product(dummyProduct).save().then((p) => {
                    chai.request(server)
                    .put(`/products/${p._id}`)
                    .send({ name: 'test12', description: 'test', price: 14 })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.a.property('message').eql('Updated')
                        // // Check User details
                        res.body.data.should.have.property('name').to.be.a('string')
                        res.body.data.should.have.property('name').eql('test12')
                        res.body.data.should.have.property('_id').to.be.a('string')
                        res.body.data.should.have.property('price').to.be.a('number')
                        res.body.data.should.have.property('price').eql(14)
                        res.body.data.should.have.property('description').eql('test')
                    done()
                    })
                })
            })
        })
        // Test error handling
        it('it should handle error when incorrect product id is present in the url', (done) => {
            chai.request(server)
            .put(`/products/gibberish`)
            .send(dummyProduct)
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.be.a('object')
                res.body.should.have.property('errors').eql(true)
                res.body.should.have.a.property('logError').eql('CastError: Cast to ObjectId failed for value "gibberish" at path "_id" for model "Product"')
                res.body.should.have.a.property('details')
                expect(Object.keys(res.body.details).length).eql(3)
                res.body.details.should.have.a.property('kind')
                res.body.details.should.have.a.property('value')
                res.body.details.should.have.a.property('reason')
                done()
            })
        })
        it('it should handle error when no product object is present in request', (done) => {
            new User(dummyUser).save().then((u) => {
                dummyProduct.user = u._id
                new Product(dummyProduct).save().then((p) => {
                    chai.request(server)
                    .put(`/products/${p._id}`)
                    .send({})
                    .end((err, res) => {
                        res.should.have.status(400)
                        res.body.should.be.a('object')
                        res.body.should.have.property('errors').eql(true)
                        res.body.should.have.a.property('logError').eql('Invalid request body')
                        res.body.should.have.a.property('details')
                        expect(Object.keys(res.body.details).length).eql(4)
                        res.body.details.should.have.a.property('kind')
                        res.body.details.should.have.a.property('value')
                        res.body.details.should.have.a.property('reason')
                        done()
                    })
                })
            })
        })
    })
})