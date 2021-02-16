# User API

### API Token
We need to use an API token for any of these calls to work. And the user associated with that token must have the permission to do said API call. 
- For example, you cannot get all the users if the email associated only has user level permission, you need super level permission.
- A token is generated through the Admin dashboard, pick an email to associate the token to and save the token
    - In an api call, the format is this: `token=<email>:<token>`
        - an example call would be: 
        - `GET https://data.usagm.gov/api/survey/moas?country=Afghanistan&token=admin@example.com:XXXXXXXXXXX`

![picture of Admin Dashboard generating api token](../readme-token.png)


Once you create a token through the admin dashboard, you will be able to make calls. Note that you will only see the token once, so be sure to save it in a safe place. 

To see the admin dashboard, your user role must be set to Admin or Super

You can also revoke tokens through the admin dashboard, there is a table for you to keep track of all tokens.

### Users
We have middleware in place that checks a request's role to see if they are authorized to do what was requested. The entire back-end architecture is centered around this. You only have access what your role allows. You cannot be logged into a user-level role and try to do admin-level tasks or see admin-level material.


### Ticket/Email
This API also houses both the ticketing and email flow.

We have a ticketing system in place where a user can submit a help ticket describing their problem, which will then be sent to the admin dashboard so that an admin can see the ticket and address the issue. Behind the scenes, the continuation of the ticket thread will be in the users email and the admin dashboard. The user will be able to reply to the email and continue on the conversation with the admin.

We also send emails during the onboarding process of a new user. When a new user signs up, they first are routed to login.gov specific for us. A user will create a login.gov account, then once they sign in they will be routed to the application to a landing page that tells them to check their email and wait for approval. 
- at this point, an email is sent to the user, saying that an admin will review their account. An email is also sent to the admin emails to notify them of the new user requesting access. The admin will then see that user in the users table on the admin dashboard, with their status as "pending". Once the admin approves them, an email is sent to that user notifying them of that approval and allowing them to sign in.
- **NOTE:** currently all emails ending with @usagm.gov are automatically approved and don't go through this process.