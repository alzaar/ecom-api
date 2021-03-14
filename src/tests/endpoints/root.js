import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../../server'

// Enable Chai Config when testing
chai.should()
chai.use(chaiHttp)

//  ADD MORGAN LOGS and change env to test for this
process.env.NODE_ENV = 'Test'

describe('Summary for all endpoints', (done) => {
    describe('/_ Root Path', () => {
        it('it should have empty paths in response', (done) => {
            chai.request(server)
            .get('/_')
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.should.have.property('errors').eql(false)
                res.body.should.have.property('message').eql('Route_Paths')
                res.body.should.have.property('products').be.a('array')
                res.body.should.have.property('products').to.have.length(5)
                res.body.should.have.property('users').be.a('array')
                res.body.should.have.property('users').to.have.length(5)
                done()
            })
        })
    })
})
