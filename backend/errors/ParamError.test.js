
"use strict";

const ParamError = require('./ParamError')

describe('Lib:ParamError', () => {

    test('ParamError()', (done) => {

        let msg = 'This is a custom user error'
        
        try {
            throw new ParamError(msg)
        }
        catch(err){
            expect(err.toString()).toEqual('Error: ' + msg)
            done()
        }

    });

    test('ParamError().code', (done) => {

        let msg = 'This is a custom user error'
        
        try {
            throw new ParamError(msg)
        }
        catch(err){
            expect(err.code).toEqual(401)
            done()
        }

    });

})
