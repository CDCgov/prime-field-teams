
'use strict';
const Settings = require('../Settings');
const Logger = require('../utils/Logger');
const path = require('path');
const fs = require('fs');
// Bring in models and pass db connection object
const {Schema, SchemaField, SchemaMapping, Organization} = require('../models');
const Papa = require('papaparse');
const slugify = require('slugify');

async function importMaster(){

    const filename = path.join(__dirname, './master.csv');
    const data = fs.readFileSync(filename, 'utf8');
    const orgId = 1;

    const schema = await Schema.findOne({
        where: {
            organizationId: orgId
        },
        raw: true
    });

    const meta = Papa.parse(data, {
        header: true,
        dynamicTyping: true
    });    

    // Import header into schema fields
    let keyMap = {};

    for (let i=0; i<meta.data.length; i+=1){

        let row = meta.data[i];
        let slug = row.key;

        let field = await SchemaField.findOne({
            where: {
                organizationId: orgId,
                schemaId: schema.id,
                key: slug
            }
        });

        if (!field){
            Logger.debug('Creating field', slug )
            field =  await SchemaField.create({
                organizationId:orgId,
                schemaId: schema.id,
                key: slug,
                type: row.Type.toLowerCase(),
                category: row.Section,
                values: row.Values,
                min: (row.Min == '-') ? null : row.Min,
                max: (row.Max == '-') ? null : row.Max,
                description: row['Data Description'],
                notes: row['Data Point']
            });
        }

        // Also create a row in the mapping 

        let mapping = await SchemaMapping.findOne({
            where: {
                organizationId: orgId,
                schemaId: schema.id,
                schemaFieldId: field.id,
                toSchemaId: 1, // default schema
                fromKey: slug    
            }
        });

        if (!mapping) {
            mapping = await SchemaMapping.create({
                organizationId: orgId,
                schemaId: schema.id,
                schemaFieldId: field.id,
                toSchemaId: 1, // default schema
                fromKey: slug        
            });            
        }

        keyMap[slug] = field;

    }


}

setTimeout(async ()=>{

    await importMaster();

    let org = await Organization.findOne({where: {id:2}});
    
    let schema = await Schema.findOne({
        where: {
            organizationId: org.id
        }
    })

    if (!schema){
        Logger.info(`Creating new schema for org ${org.id}`);
        schema = await Schema.create({
            organizationId: org.id,
            name: "Oklahoma",
            description: ''
        })
    }


    let filename = path.join(__dirname, '../../../data/ok1.csv');
    let data = fs.readFileSync(filename, 'utf8');
    
    // for OK data, need to remove first line
    data = data.toString().split('\n'); // read file and convert to array by line break
    data.shift(); // remove the the first element from array
    data = data.join('\n'); // convert array back to string
    
    const meta = Papa.parse(data, {
        header: true,
        dynamicTyping: true
    });
    
    // Import header into schema fields
    let keyMap = {};

    for (let key in meta.data[0]){
        let slug = slugify(key, {lower:true, strict:true});
        
        let field = await SchemaField.findOne({
            where: {
                organizationId: org.id,
                schemaId: schema.id,
                key: slug
            }
        });

        if (!field){
            field =  await SchemaField.create({
                organizationId: org.id,
                schemaId: schema.id,
                key: slug                
            });
        }

        // Also create a row in the mapping 

        let mapping = await SchemaMapping.findOne({
            where: {
                organizationId: org.id,
                schemaId: schema.id,
                schemaFieldId: field.id,
                toSchemaId: 1, // default schema
                fromKey: slug    
            }
        });

        if (!mapping) {
            mapping = await SchemaMapping.create({
                organizationId: org.id,
                schemaId: schema.id,
                schemaFieldId: field.id,
                toSchemaId: 1, // default schema
                fromKey: slug        
            });            
        }

        keyMap[slug] = field;

    }

    // Now import data iteself

    /*
    for (let i=0; i<meta.data.length; i+=1){

        let row = meta.data[i];

        for (let key in row){
            let slug = slugify(key, {lower:true, strict:true});
            Logger.debug(`${slug} ${row[key]}`);
        }

    }
    */
    
    //Logger.debug(meta);

    Logger.degug('Finished');

}, 100);
