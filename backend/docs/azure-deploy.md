# Azure production deployment

**NOTE** you loose a lot of middleware magic deploying into azure in this way, and is not recommended for production deployment. The api end points will be naked and have no protection except what comes with azure - this needs to be researched.

A typical production setup for RESTful API's in the private sector is node/express behind nginx - that is a lot of protection and a significant amount of battle tested experience that these cloud functions do not have.... not that they can't be just as safe, but I would not recommend useing them in production until they've really proven themselves.