# Identity Management (IM) Service - BE

## Setup

I did not manage to get this solution deployed or containerised. Prerequisites to run this locally are to have [Node.js](https://nodejs.org/en/download/`) installed (latest version).

Run:

```
npm i & (cd app && npm i)
npm start
```

I have also included the `.env` files in git for ease of access.

## Scope and justification

The scope of this Identity Manager was limited due to time constraints. Fundamental core functions including create users (sign up), log in, create organisation, and view accounts were included. This inherently means that some of the true business logic of an identity manager have been omitted. Additionally, the use of Mongo, Express, React and Node were in the interest of building fast, and would not neceassarily be the most appropriate for a system with such requirements as this. The user interface also limited in this iteration and was only to ensure that certain actions could be demonstrated, and committing secrets to git is also something that would not happen in practice.

There are some flaws in the business logic that may not align with an IM system. Such as users being able to sign up to an organisation without an invite, or being able to create endless accounts. The features included inte scope include the sign in function, roles defined and users are only able to see the account and organisatioanl information of the organisational they are a part of. However, enforcing role-bases access control (RBAC) was not able to be fully implemented. The idea would be that read-only users would only be able to see their account, and selected organisational information. Contributors would have more access to view and also edit accounts, and admins would be the only user group to be able to view and edit other users' information.

Some security features were not able to be implemented within the scope of this implementation. Particularly features that are required at an enterprise level such as MFA and SSO.


## Areas of improvement

There are numerous areas that can be highlighted for improvement in this implementation. Most prominenently, security measures and features that are more fit for purpose when a system is related to banking. There would also need to be further authentication of the customer attempting to open an account, whether it be an individual or business account. This includes some KYC checks, or identification to ensure regulation is upheld. Other security features such as noting IP addresses of logins, login times, and MFA would be critical for monitoring potential fraudulent access attempts. 

Other features that would improve the system include:
- More granular RBAC, allow users to toggle read and write access on particular resources eg. based on resources created by particular users
- The ability to nest organisations/departments/teams would be beneficial for larger organisations or enterprises
- Improvements in code implementation such as reducing repeatability of code, enhacing extensibility, using a more strongly typed language that enforces more meticulous implementations and error checking
- Logs to help with debugging and monitoring
- Form error checking and more detailed error messages and feedback eg. toasts to improve the user experience
- Consistency and testing with UI to ensure user interactions with the app work as expected


---

## Project brief

Given the increased scrutiny on cyber-security, and upcoming regulatory crackdown, we’d rather not leak our user’s data.

SME (small-medium enterprise) banking has business’ sign up for accounts (not just individuals). Depending on SME size they may need different levels of access control, such as:

- Small SMEs (e.g. sole traders) may just need one user
- Moderate size may need 2-5 users
- The largest may need features such as SSO, MFA, password policies, external identity provider, integration, etc.

Design and implement an IM system & API to manage users and their permissions. The system should allow a user to login and access some resource based on their permissions.

### What we Expect

The task is purposely left open-ended. You are **not** expected to built a fully functional IM service that caters for the variety of requirements in SME banking. Define your own scope to best showcase your abilities - determine which requirements can be built/fulfilled in the time you are given to complete this assignment. Include this scope and reasoning behind it in your submission in the README file.

Below are some requirements and recommendations:

- Requirements:
  - **must** - you are obliged to satisfy this requirement
  - **should** - recommended, but not critical
  - **may** - optional brownie points
- The system **must** allow:
  - CRUD of users
- The system **should** allow some of:
  - Restrict actions by permissions (e.g. restrict access to a bank account to certain individuals)
  - Check if user can perform a given action
  - User login
  - CRUD permissions
- The API **should** be used by some form of UI. This could be:
  - Basic functional API documentation e.g. Swagger/Readme.io
  - Custom UI (preferable)
- The solution **should** be readily accessed. This could be through either:
  - Containerisation for local deployment, with strong documentation on how to setup
  - Deployable to public cloud with instructions
  - Self hosted with a link included
- The solution **may** include a test suite
- The submissions **must** include a written summary as a `README.md`, that **should** cover
  - Instructions on how to deploy and run
  - Included scope and justification
  - Key decisions and tradeoffs you made in build
  - Areas of improvement in system

### Getting Started

To get started, please clone the repo [here](https://github.com/cxnpl-au/recruitment).

### Submitting

- Make your submission as a PR to the main branch
  - Under a new branch called `submission/<your-email>`
- Ensure you have included the written summary `README` that covers the above points

Feel free to ask any questions, good luck!
