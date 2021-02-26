import User from './User.js';

describe('/models/User', () => {

    describe('create', () => {

        test('should return data', async () => {
    
            // Create a new User
            let User = new User();
            await User.save();
                
            console.log('type = ', User.type)
            expect(User.type).toBe('text');
            expect(User.required).toBe(true);
            expect(typeof User.id).toBe('string');
    
            return;
    
        });


    });
    


});