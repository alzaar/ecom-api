import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../../server'
import User from '../../models/user'
import chaiDateString from 'chai-date-string'
import { dummyUser } from '../configData'
// Enable Chai Config when testing
chai.should()
const expect = chai.expect
chai.use(chaiDateString)
chai.use(chaiHttp)

//  ADD MORGAN LOGS and change env to test for this

describe('Users', (done) => {
    beforeEach((done) => {
        User.deleteMany({}, (err) => {
            done()
        })        
    })

    // Create a User
    describe('/POST User', () => {
        it('it should not create a user without any issue', (done) => {
            chai.request(server)
            .post('/users')
            .send(dummyUser)
            .end((err, res) => {
                res.should.have.status(201)
                res.body.should.be.a('object')
                res.body.should.have.property('errors').eql(false)
                res.body.should.have.property('data')
                res.body.data.should.be.a('object')
                // Check User details
                res.body.data.should.have.property('username').to.be.a('string')
                res.body.data.should.have.property('_id').to.be.a('string')
                res.body.data.should.have.property('password').to.be.a('string')
                res.body.data.should.have.property('password').to.have.lengthOf.above(4)
                res.body.data.should.have.property('email').to.be.a('string')
                expect(res.body.data.date).to.be.a.dateString()
                done()
            })
        })
        // Test error handling
        it('it should handle error when missing fields are present', (done) => {
            chai.request(server)
            .post(`/users`)
            .send({})
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.be.a('object')
                res.body.should.have.property('errors').eql(true)
                res.body.should.have.a.property('logError').eql('Invalid request body')
                res.body.should.have.a.property('message').eql('Missing fields -- username, password or email')
                done()
            })
        })
    })

    // GET for all Users - Test
    describe('/GET users', () => {
        it('it should get all users', (done) => {
            chai.request(server)
            .get('/users')
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
         it('it should handle error missing jwt', (done) => {
            done()
            //Todo -- add after JWT addition
        })
    })

    // Delete a user
     describe('/DELETE User', () => {
        it('it should check for user deletion', (done) => {
            new User(dummyUser).save().then((u) => {
                chai.request(server)
                .delete(`/users/${u._id}`)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('errors').eql(false)
                    res.body.should.have.a.property('message').eql('Deleted')

                    done()
                })
            })
        })
        // Test error handling
        it('it should handle error when invalid user id is present on DELETE', (done) => {
            chai.request(server)
            .delete('/users/gibberish')
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.have.property('errors').eql(true)
                res.body.should.have.property('message')
                done()
            })
        })
    })

    // GET User based on id
    describe('/GET:id users', () => {
        it('it should get user based on id', (done) => {
            const user = new User({
                username: 'test',
                email: 'test@test.com',
                password: 'test13',
            })
            user.save().then((u) => {
                chai.request(server)
                .get(`/users/${u._id}`)
                .send(u)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('errors').eql(false)
                    res.body.should.have.property('data')
                    res.body.data.should.be.a('object')
                    // Check User details
                    res.body.data.should.have.property('username').to.be.a('string')
                    res.body.data.should.have.property('_id').to.be.a('string')
                    res.body.data.should.have.property('password').to.be.a('string')
                    res.body.data.should.have.property('password').to.have.lengthOf.above(4)
                    res.body.data.should.have.property('email').to.be.a('string')
                    expect(res.body.data.date).to.be.a.dateString()

                    done()
                })
            })
        })
    })

    // Update a user
    describe('PUT/:id user', () => {
        it('it should UPDATE a user given the id', (done) => {
            let user = new User({
                username: 'test',
                email: 'test@test.com',
                password: 'test13',
            })

            user.save().then((u) => {
                chai.request(server)
                .put(`/users/${u._id}`)
                .send({username: 'test12', email: 'test@mail.com', password: 'test14'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.a.property('message').eql('Updated')
                    // Check User details
                    res.body.data.should.have.property('username').to.be.a('string')
                    res.body.data.should.have.property('username').eql('test12')
                    res.body.data.should.have.property('_id').to.be.a('string')
                    // Add diff password logic
                    res.body.data.should.have.property('email').to.be.a('string')
                    res.body.data.should.have.property('email').eql('test@mail.com')
                done();
                });
            });
        })
    })
})