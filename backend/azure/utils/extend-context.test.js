const extendContext = require('./extend-context');
const Logger = require('../../utils/Logger');

describe('/azure/utils/extend-context', () => {

    test('setup', () => {

        let contextMock = {
            status: 200,
            done: () => {
                Logger.debug(this.res.body);
            }
        }
        
        extendContext(contextMock);    
        
        // There should be a res objext on the context
        expect(contextMock.status).toEqual(200); 
        expect(typeof contextMock.res.send).toEqual('function'); 
        expect(typeof contextMock.res.json).toEqual('function'); 
        expect(typeof contextMock.res.status).toEqual('function'); 
    });

    test('context.res.status', () => {

        let testOut = null;
        let contextMock = {
            status: 200,
            done: function(){
                testOut = contextMock.res.body;
            }
        }
        
        extendContext(contextMock);   

        const testStr = 'a test string';

        contextMock.res.status(501);
        expect(contextMock.status).toEqual(501); 

        // Test chaining
        contextMock.res.status(501).send(testStr);
        expect(contextMock.status).toEqual(501); 
        expect(testStr).toEqual(testOut); 

    });

    test('context.res.send', () => {

        let testOut = null;
        let contextMock = {
            status: 200,
            done: function(){
                testOut = contextMock.res.body;
            }
        }
        
        extendContext(contextMock);   

        const testStr = 'a test string';
        contextMock.res.send(testStr);

        expect(testStr).toEqual(testOut); 

    });

    test('context.res.json', () => {

        let testOut = null;
        let contextMock = {
            status: 200,
            done: function(){
                testOut = contextMock.res.body;
            }
        }
        
        extendContext(contextMock);   

        const testObj = {
            key1: 'key1-data', 
            key2: {
                keyArray: [1,7,3,8]
            }
        };

        contextMock.res.json(testObj);

        expect(testObj.key1).toEqual(testOut.key1); 
        expect(testObj.key2).toEqual(testOut.key2); 
        expect(testObj.key2.keyArray).toEqual(testOut.key2.keyArray); 

    });
});