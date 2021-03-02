const express = require('express');

/**
 * Extend the azure context object with mocks for handling express routes
 * @see https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference-node?tabs=v2#context-object
 * @param {object} context Azure context object
 */
function extendContext(context){

    context.res = express.request;

    /**
     * Send a plain text message back to the client
     * @param {string} msg 
     */
    context.res.send = function(msg){
        context.res.body = msg;           
        context.done();
    };

    /**
     * Send a object back to the client
     * @param {object} obj Data to send in the response body
     */
    context.res.json = function(obj){
        context.res.body = obj;           
        context.done();
    };

    /**
     * Set the http response status code
     * @param {int} code 
     */
    context.res.status = function(code){
        context.status = code;
        // Allow for chaining
        return {
            send: context.res.send,
            json: context.res.json
        }
    };


    return context;

}

module.exports = extendContext;