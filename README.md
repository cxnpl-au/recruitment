# Identity Management (IM) Service - BE
## Introduction
This is an Identity Management (IM) system designed as a project task for Constantinople recruitment
process.

## Usage and Deployment Instructions
An OpenAPI 3.0 compliant file `openapi.yaml` contains the documentation for the API. This can be
imported into either SwaggerUI, ReadMe, Postman, or Insomnia for ease of viewing.

The current version of the API is hosted [here](https://bvtrmgoisi.execute-api.ap-southeast-2.amazonaws.com/prod) with the below endpoints:
- `/accounts`,
- `/organisations`, and
- `/users`

To redeploy the API for local use, four AWS resources are required:
- Two DynamoDB tables called `organisations` and `users` with string partition key `alias` and
  composite primary key consisting of string partition key `org` and string sort key `alias`
  respectivel,
- API Gateway integration, the OpenAPI specification can be imported or it can be manually created,
  and
- A Lambda function to bridge the API and DynamoDB, the folder `lambda` can be uploaded to the
  lambda function directly

## Scope
The scope of the API was constrained to allow CRUD of three types of resources:
- Organisations,
- Users, and
- Accounts

The above resources come together to form a hierarchial relationship between organisations and
users and organisations and accounts while also forming many-to-many relationships between users and
accounts.

The API was limited to the above three resources as their interrelationship is complex enough to
show different aspects of the API design while also being minimal. The relationship of these
resources also lends itself well to an authentication and authorisation scheme where users must
first be authenticated to prove their legitimacy as being part of a given organisation and, further,
they have specific defined roles that allow them to be authorised for increasingly priviliged
actions.

The defined roles for users of an organisation are:
- `ADMIN`,
- `ACCOUNT_MANAGER`, and
- `NORMAL`

A special account, 'root', also exists which has a superset of the abilities of ADMIN accounts. The
additional actions the root account can undertake are:
- RENAME ORGANISATION,
- CHANGE LIMITS:
  - ACCOUNT LIMITS,
  - AUTHENTICATION TIMEOUT SECS, and
  - USER LIMITS
- DELETE ORGANISATION

Effectively, the root account is the only account authorised for UPDATE and DELETE actions on an
organisation level. It is created when the organisation is created.

Each role has increasingly restricted access to the users and accounts:
- `ADMIN` accounts are allowed full CRUD of users and accounts,
- `ACCOUNT_MANAGER` accounts are allowed full CRUD of accounts but not users, and
- `NORMAL` accounts can only read accounts

Additionally each user is allowed to change their own name (not their alias/username as it is
unique) as well as their password if they remember the old password - if they cannot remember their
password an ADMIN account or root can change their password for them.

In terms of authentication, the supplied user password is checked against a salted and hashed
SHA-256 password. If the supplied password matches the hash the user is authenticated and a token is
generated for further use of the API in read-only settings. Any modifications to resource, including
a users own password and name require the re-entering of their password and the issued token is not
considered.

In summary, the API allows CRUD of organisations, users, and accounts while also maintaining an
authentication/authorisation paradigm with users given increasingly priviliged actions based on
their assigned role.

## Decisions and Tradeoffs
### Technology stack
The API is serverless, built using AWS's API Gateway, DynamoDB, and Lambda services. This was chosen
as it allows flexible scaling of the API to any number of users as well as showing skills in working
with a serverless stack on AWS.

The language chosen for the Lambda function is Python and its associated AWS boto3 SDK. This was
chosen due to familiarity with the language as well as ease and agility of initial prototyping and
development.

DynamoDB was chosed instead of a traditional relational database due to its flexibility with its
schema as well as its ability to scale in tandem with the Lambda function.

### API Design
A majority of time was spent in exploration of the API design as it has the most significant impact
on the schema of and data access patterns in DynamoDB. It is also the most user-exposed part of the
system and major changes in the API can cause large knock-on effects on any users of the API as well
as end-users.

#### ID-centered approach
The first version of the API worked with numeric IDs for organisations, users, and account. A unique
ID would be generated for each created organisation, user, and account. This was done in order to
facilitate better data distribution in DynamoDB as non-repeated numeric IDs would be partitioned
better in allocated Read and Write units allowing for better scalability.

This approach lost favour due to two issues:
- if we wanted to maintain good access patters in DynamoDB due to the choice of numeric IDs for the
  partition key, we would have to ask users for the ID of the resource they want to query which can
  be hard to remember and cumbersome to use
- if we instead decided for a more user-friendly approach where they would only have to provide an
  alias of the resource instead of the ID, we would have to then scan through the entire DynamoDB
  table to find the alias for the associated ID. This completely negates the benefit of using
  numeric IDs as primary keys for better distribution and scalability and could potentially cost a
  lot as a scan would be done on every request

#### Nested resources with path parameters
This was a modification of the ID-centered API where IDs would be required in path parameters to
access resources. The resources would also be nested like
```
/organisations/{org_id}/users/{user_id}/accounts/{account_id}
```

The logic for path validation as well as parsing of IDs became unnecessarily complicated with very
little return in improvement of access patterns for DynamoDB. This also has the two issues of the
ID-centered approach albiet at a reduced scale as, once a resource ID would be returned, it wouldn't
need to be scanned for again at every API call as it would be provided in the URI path. However, an
initial scan was still required to find the ID from the table given an alias of a resource.

#### Flat architecture with string IDs
The flat architecture was designed with all payload data (including resource aliases) being provided
in the body of the request.

The API calls now became
- /organisations,
- /users, and
- /accounts

Numeric IDs for each resource were also removed in favour of easier-to-remember string aliases as
the primary key for each table. This solved the user-unfriendliness and complexity of the previous
iterations at the cost of potentially reduced distributability of the work in DynamoDB if aliases
are concentrated around any specific substring prefixes in the tables.

### DynamoDB
#### Access Patterns
As mentioned previously, access patterns for DynamoDB as well as user-convenience were one of the
main concerns when designing the system. For the current architecture of organisations, users, and
accounts there was an issue of whether to use numeric IDs or string IDs in the main organisation
DynamoDB table.

For user-convenience, the API would mainly require the use of easier-to-remember aliases for
resources. This causes issues if the choice is made to use numeric IDs for the partition key in the
main organisation table because looking up an ID from an alias would require very expensive scan at
almost every API call. Conversely, it would also be costly to maintain uniqueness of aliases across
the table as it would also require a scan operation in the entire table.

A compromise was made in favour of user-convenience where the partition key of the organisation
table was made to be the string alias instead of a numeric ID. This solves the issue of numerous
costly scans in the table, reducing costs, and simplifies the overall schema at the cost of less
scalability in 'hot' partitions.

#### Schema Design
There are three relationships that must be considered when designing the schema for the
organisation, user, and account resources:
- An organisation can have many users (one-to-many),
- An organisation can have many accounts (one-to-many), and
- A user can access many accounts and an account can be seen by many users (many-to-many)

Therefore, to limit the complexity of the schema, a choice was made to put some (soft) limits on the
number of users that can be created in an organisation as well as the number of accounts assigned to
the organisation.

A key idea for the current design of the scheme is that the number of accounts allocated to an
organisation is likely to be a lot smaller than the number of users that could be in an
organisation. Thus, a choice was made to keep the accounts of the organisation in-line in the
organisation document and to separate the users into their own table. The users table has the
organisation alias as the partition key and the user alias as a sort key, allowing for quick lookup
for any user in an organisation.

In this way, we avoid overpopulating any one organisation document in the main organisation table
and thus stay away from the 400KB limit for any one document that DynamoDB has. With this two table
schema, an organisation can scale to tens of thousands of users without worry of reaching the
document limit.

However, a less likely but theoretically possible case could be the number of accounts causing the
organisation table to hit the 400KB document limit. In this case, a similar approach to users could
be taken with a new table allocated for accounts with the organisation alias as the partition key
and the account name as the sort key.

Additionally, to reduce the complexity of the the many-to-many relationship between users and
accounts, the API and schema only control account create, read, update, and delete permissions via
user roles instead of giving granular CRUD access to each user for each account. To achieve
per-user-per-account CRUD access an additional information would need to be recorded for each
account and each user which would necessitate the creation of an intermediate table which would hold
the granular access permissions for each user and each account they can create, read, update, or
delete.

### Security and Access Tokens
The current API uses SHA-256 hashes with a salt to provide a layer of security for sensitive data
such as passwords and IP addresses which are used for authentication. To improve upon the current
scheme, Multi-Factor Authentication (MFA) would be required to reduce the risk of an attacker
accessing an organisations resources via brute-forcing the password.

To facilitate easier access for read-only requests, the concept of a token is introduced. This token
is generated whenever a user is authenticated in the system and is unique for each authentication
attempt. While the user has not been timed out, changed devices (change in IP address), or logged
out they can use this token to access resources for read-only requests for added convenience.

Create, update, and delete requests always require the user to authenticate with their password and
a provided token is not considered. Changes in passwords for a user automatically log them out of
the system and the new password is required for any further request.

## Areas of improvement
- Python as a language is a good choice for developing prototypes and proof-of-concepts quickly,
  however, its dynamic typing causes a lot of issues and makes writing code error-prone and risky
  to deploy in production scenarios
- In terms of security, passwords and other sensitive information like IP-addresses are salted and
  hashed. Any additional improvements to the security would come in the form of MFA to provide an
  additional layer of deterrence to hackers. This is a key improvement that was left out of the
  scope of the initial API construction that should be included.
- Currently there is very little feedback to users of the API in case something goes wrong - only
  HTTP states codes are returned to the users in most cases of API usage. This should be changed to
  provide better error messages in the HTTP body to guide implementors and users of the API where
  they went wrong and how to remediate any issues they face without always having to rely strictly
  on the documentation.
- There are also very likely to be a few bugs and edge-cases that might not have been considered and
  slipped through testing
