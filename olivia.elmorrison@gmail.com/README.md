# Identity Management (IM) Service - BE

This system is a simple version of a project management system it provides users with the ability to create a business, log in, update team members permissions, create new projects which the business may be working on and track what their estimated profit will most likely be for each project.

This system was build using a combination of technologies such as React, Node.js, Express, and MongoDB. The web application allows users to sign up and create an account by providing their personal information such as name, email, and password. Once registered, users can log in using their credentials and access their dashboard.

Once team members join the business they automatically have no permissions and the owner can set their permissions. Depending on the permissions, team members can view different parts of the business such as the team members, new projects. Additionally, they are restricted from updating certain entities if their permissions are not sufficient.

This is a very simple system which restricts actions based on permissions both in the front and backend.

Overall, this system provides users with an easy-to-use platform for managing their businesses and projects.


# Instructions on how to deploy and run

This application is dockerised, to run it on your local machine pull the contents of this branch and run command below in the "olivia.elmorrison@gmail.com" directory

`docker-compose up --build`

This should host the application on port 3000

If this doesn't work, some enviroment variables may need to be tailored to your computer but let me know if you have any trouble!

# Included scope and justification

There were two main reasons for limiting scope. 

The first being time and resources. Building a system with a limited scope helps to manage time and resources effectively you are able to focus on specific features and functionalities.

The main features I was wanting to include in this system was, ability to log in, sign up, log out and create a business. Allowing users to manage their personal data while also making the platform available for all. By allowing these user functions this meant the requirement for authorisation based on whether or not a real user is logged in.

Another feature which was integral to this system was to allow admins to control the changes their team is allowed to make on their business. This ensures that admins/business owners have a holistic view of what is happening in their business while also being able to allow and deny users access to different functionality on this system. This feature required the need for each user to hold 1 of 4 permissions *none, submitter, approver and admin*.

The second reason for limiting scope is scalability. 

There are two factors to this: 
- One is that systems should created generally enough to be able to apply to a larger stakeholder group. For example if we were to only make this system specifically for businesses who sell baked goods we would be limiting ourselves to that customer group.
- The other is that by creating a smaller more robust system this allows room for easy scalability in a technical sense. Often when you are starting to build a system it seems beneficial to scale vertically, by that I mean add as many features as you can. However this can leave the system in a difficult state when trying to scale horizontally, for example adding more businesses. The cost of change increases with the more complexity you add. A balance of both new features and horizontal scalability are important to sustain the success of a system. 


# Key decisions and tradeoffs you made in build

In the interest of time there were a few trade offs I needed to make.

**Usability vs. Security:** 
Adding more security measures to a system can make it more difficult to use. Balancing usability and security is important, as users are more likely to abandon a system that is difficult to use. I am more of a front end engineer and work with user groups often and have found that the usability of a product is often preferable to security. This is depending on the nature of the product, for a product like this it is unlikely to be very personal information stored which is why I decided to make some tradeoffs for usability over security. For example styling on the home page vs hashing passwords. However there are still sufficient security measures such as authorisation.

**Flexibility vs. Maintainability:** 
Building a system that is highly customizable can make it more difficult to maintain. Similarly building a system that is easy to maintain may limit its flexibility.
In this system there are a few abstracted methods and components to ensure maintainability but I found that the cost of extracting some of these methods and components outweighed the benefit in ensuring that the system was flexible and the cost of change was low.



# Areas of improvement in system

**Security**

Ideally password should be hashed for security reasons. Hashing passwords helps to protect user data in case the database is compromised or hacked.

If passwords are stored in plain text, anyone who gains access to the database can read and use them. Hashing ensures that even if a hacker gains access to the database, they cannot read or use the passwords. When a user logs in, the system hashes the password they enter and compares it to the hashed password stored in the database. If they match, the user is granted access.

Hashing also helps to prevent dictionary attacks and brute-force attacks, where hackers use automated tools to guess passwords. With hashing, even if the hacker guesses the hashed password, they still need to spend time and resources to guess the original password.

In summary, hashing passwords is an essential security practice that helps protect user data and prevents unauthorized access to sensitive information.

**Performance** 

For an application of this size the performance is negligable however as a system scales it is best to look for ways to optimise these calls both in the front end and back end.

Examples of ways to do this would be to use caching in the front and backend. In the front end this can minimise the number of HTTP requests the application sends. Implement caching mechanisms for the system stores frequently used data in memory, reducing the need for the application to query the database.

**Functionality** 

- The dashboard would ideally allows users to create a business, view their team members, and project based on their permissions. Users can create a new business by providing information such as the business name, industry, and location. Once a business is created, users can invite team members by providing their email addresses. The team members will receive an email inviting them to join the business.
- Team admins would ideally be able to invite their team members to the business rather than them having to sign up and then having restricted access.
- Further security features including password reset, email verification, and two-factor authentication to ensure the security of user accounts. 
- Each project would have more details regarding what the expenses are, how long has been spent on each project, who is working on the project etc.


