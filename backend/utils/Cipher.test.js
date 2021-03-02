
"use strict";
const Cipher = require('./Cipher');
const Logger = require('./Logger');
const Chance = require('chance');

if (!process.env.DATABASE_ENCRYPT_KEY){
    process.env.DATABASE_ENCRYPT_KEY = 'sdhertu457erthdfrjhdfjhd';
}

describe('Common:Utils:Cipher', () => {

    beforeAll((done) => {        
        // Wait for database connection
        setTimeout(done, 250);
    });

    test('should encrypt', (done) => {

        const chance = new Chance();
        let test = chance.paragraph();

        let encoded = Cipher.encode(test);
        
        expect(encoded).not.toEqual(test);

        return done();

    });

    test('should decrypt', (done) => {

        const chance = new Chance();
        let test = chance.paragraph();

        let encoded = Cipher.encode(test);
        let decoded = Cipher.decode(encoded);
    
        //Logger.warn('encoded = ', encoded);
        //Logger.warn('decoded = ', decoded);
    
        expect(encoded).not.toEqual(test);
        expect(decoded).toEqual(test);        

        return done();

    });    


    test('should decrypt an object', (done) => {

        const chance = new Chance();

        let test = {
            txt: chance.paragraph(),
            no: chance.d10()
        }

        let encoded = Cipher.encodeObject(test);
        let decoded = Cipher.decodeObject(encoded);
    
        //Logger.warn('encoded = ', encoded);
        //Logger.warn('decoded = ', decoded);
    
        expect(encoded).not.toEqual(test);
        expect(decoded).toEqual(test);        

        return done();

    });  

    test('should create a checksum', (done) => {

        let test = 'My dog is a crazy dog';

        let cs = Cipher.checksum(test);
    
        expect(cs).toEqual('08f32a9b249e3ecf2f3f3f84a6910604cd6493e9d8be7f45b6d3c7cfe7503db0');        

        return done();

    });        

    test('should create a hash', (done) => {

        const chance = new Chance();
        let test = chance.paragraph();

        let hash = Cipher.hash(test);
    
        Logger.warn('test = ', test);
        Logger.warn('hash = ', hash);
    
        expect(hash).not.toEqual(test);

        return done();

    });  

    test('should create a repeatable hash', (done) => {

        const chance = new Chance();
        let test = chance.paragraph();

        let hash1 = Cipher.hash(test);
        let hash2 = Cipher.hash(test);
        let hash3 = Cipher.hash(test);
        let hash4 = Cipher.hash(test);
    
    
        expect(hash1).not.toEqual(test);
        expect(hash2).toEqual(hash1);
        expect(hash3).toEqual(hash1);
        expect(hash4).toEqual(hash1);

        return done();

    });    

})

