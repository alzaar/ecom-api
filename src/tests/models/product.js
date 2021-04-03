import chai from 'chai'
import Product from '../../models/product'

const expect = chai.expect
 
describe('Product Model', () => {
    it('should be invalid if product name is empty', function(done) {
        const p = new Product()    
        p.validate((err) => {
            expect(err.errors.name).to.exist
            done()
        })
    })

    it('should be invalid if password is empty', function(done) {
        const p = new Product()    
        p.validate((err) => {
            expect(err.errors.description).to.exist
            done()
        })
    })
})
