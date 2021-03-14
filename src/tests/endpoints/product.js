import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../../server'
import Product from '../../models/product'
import chaiDateString from 'chai-date-string'

// Enable Chai Config when testing
chai.should()
const expect = chai.expect
chai.use(chaiDateString)
chai.use(chaiHttp)

//  ADD MORGAN LOGS and change env to test for this
process.env.NODE_ENV = 'Test'

describe('Products', (done) => {
    beforeEach((done) => {
        Product.deleteMany({}, (err) => {
            done()
        })        
    })

    // Create a product
    describe('/POST Product', () => {
        it('it should not create a product without product field details', (done) => {
            const product = {
                name: 'Random Book',
                price: 45,
                description: 'Book\'s description',
                date: new Date()
            }

            chai.request(server)
            .post('/products')
            .send(product)
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
    })

     // Delete a Product
     describe('/DELETE products', () => {
        it('it should check delete functionality for a product', (done) => {
            const product = new Product({
                name: 'Random Book',
                price: 45,
                description: 'Book\'s description',
                date: new Date()
            })

            product.save().then((p) => {
                chai.request(server)
                .delete(`/products/${p._id}`)
                .send(p)
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

    // GET Product based on id
    describe('/GET{id} products', () => {
        it('it should get product based on id', (done) => {
            const product = new Product({
                name: 'Random Book',
                price: 45,
                description: 'Book\'s description',
                date: new Date()
            })
            product.save().then((p) => {
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
    })

    // Update a Product
    describe('PUT/:id Product', () => {
        it('it should UPDATE a product given the id', (done) => {
            let product = new Product({
                name: 'Random Book',
                price: 45,
                description: 'Book\'s description',
            })

            product.save().then((p) => {
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
})