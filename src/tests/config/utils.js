import chai, { expect } from 'chai'
import chaiDateString from 'chai-date-string'
import { EMAIL_REGEX } from '../../config/constants'
import sinon from 'sinon'

chai.should()
chai.use(chaiDateString)

describe('Utils Tests', () => {
    it('should test Email Regex to be valid', (done) => {
        const spy = sinon.spy()
        const email = 'abc@gmail.com'
        spy({
            isValidEmail: EMAIL_REGEX.test(String(email).toLowerCase())
        })
        sinon.assert.calledWith(spy, sinon.match({ isValidEmail: true }))
        done()
    })

    it('should fail when email is invalid', (done) => {
        const spy = sinon.spy()
        const email = 'abcgmail.com'
        spy({
            isValidEmail: EMAIL_REGEX.test(String(email).toLowerCase())
        })
        sinon.assert.calledWith(spy, sinon.match({ isValidEmail: false }))
        done()
    })
})
