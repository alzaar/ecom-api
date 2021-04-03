import chai from 'chai'
import User from '../../models/user'

const expect = chai.expect

 
describe('User Model', () => {
    it('should be invalid if username is empty', function(done) {
        const u = new User()    
        u.validate((err) => {
            expect(err.errors.username).to.exist
            done()
        })
    })

    it('should be invalid if password is empty', function(done) {
        const u = new User()    
        u.validate((err) => {
            expect(err.errors.password).to.exist
            done()
        })
    })

    it('should be invalid if email is empty', function(done) {
        const u = new User()    
        u.validate((err) => {
            expect(err.errors.email).to.exist
            done()
        })
    })
})