import chai from 'chai'
import Order from '../../models/order'

const expect = chai.expect
 
describe('Order Model', () => {
    it('should be invalid if product name is empty', function(done) {
        const o = new Order()
        o.validate((err) => {
            expect(err.errors.user).to.exist
            done()
        })
    })
})
