
# Identity Management (IM) Service - Solutions Engineer 

## Project Overview
* DESIGN + DIRECTION - Solutions Engineer role [CURRENT APPLICATION]
    * More relevant to role  
* BUILD/IMPLEMENTATION - Backend Software Engineer role [NOT APPLIED]
    * Less relevant to role but good learning opportunity
    * Keen to hear feedback and learn with this one. Will be good to get better understanding of typical approach and how it can be relvant to Solutions Engineering role
* TESTING

## Project Scope Objectives + Justification
* Objective 1: Baseline user and permissions management - CRUD
    * Justification: Applies to SMEs of all sizes hence larger impact
    * Constantinople DB within BigQuery consisting of below tables
        * cxnpl.users
        * cxnpl.permissions
* Objective 2: Introduce additional security features - SSO + MFA
    * Justification: Specific to large SMEs only. Security concerns still crucial

## Project Plan
1. Implementation:
    * Create REST API using Flask
    * Connect to a managed database (e.g. PostgreSQL, MySQL) to store user and permission data
    * Implement login (SSO + MFA) and permission-checking functionality  in conjunction with IAM roles
2. Create API Documentation + Testing:
    * Use Swagger for basic UI that interacts with the API (ease of testing)
3. Testing
    * Use unittest module, create a class consisting of various testing methods
    * Example Test Methods:
        * User with incorrect MFA -> Ensure error code 401 received along with Unauthorized error message
        * Create user -> Updating user email -> Get users (check email has been updated) -> Update permissions -> Check permissions -> Delete user -> Get users to ensure user has been deleted 


## API Endpoints
* users
    * POST /users
    * GET /users
    * PUT /users/<user_id>
    * DELETE /users/<user_id>
* permissions
    * POST /permissions
    * GET /permissions
    * PUT /permissions/<user_id>
    * DELETE /permissions/<user_id>

## Reflection
* What went well:
    * Exploration/Research - Much of this task was unfamiliar to me. The research throughout meant a solution could be brought to life. Additionally, I found it quite motivating being able to learn about new tools along the way (e.g. Flask, Swagger)
    * Planning - Having a clear plan from the start, made implementation enabled much more methodical
    * Independence + Problem-solving - Wasn't totally reliant on any one person or anything to put something together

* What didn't go so well:
    * Organisation - Access issues + holiday period meant started relatively late. Starting earlier would've led to something more comprehensive and accurate. Would've given more time for asking questions + testing
    * Questions - Ties back to previous point, but should have discussed key considerations with team prior to implementation
    * Testing - Was having trouble with setup for ttesting. Having this would have been valuable in tracking progress + ensuring reliability
    * API Documentation + Deployment Instructions - Ommitted due to time. Again, important piece that would have been valuable to have.
        * Trade-off: Important that documentation and instructions are clear, so better off to not rush through and have it filled with errors




