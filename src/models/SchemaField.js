import BaseModel from './BaseModel';

class Schema extends BaseModel {    

    constructor(orgId, schemaId, data) {
        super('org', data);
        // Schema lives in the org service, so has a sub-path to reference it
        this.organizationId = orgId;
        this.schemaId = schemaId;
        this.setSubPath(`${orgId}/schema/${schemaId}/field`);
        this.setSaveKey('schemaField');
    }  
 
    // ///////////////////////////////////////////////////////////////////////////////////////

    async getAll() {
                
        let items = [];
        const data = await this._send('get', '');

        for (let i=0; i<data.length; i+=1){
            
            let tmp = new this.constructor(this.organizationId);
        
            // Assign data to this 
            for (let key in data[i]){
                tmp[key] = data[i][key];
            }

            items.push(tmp)
        }

        return items;
    }        
}


export default Schema;