# org-shart-mongo-backend

> Spent the last few days teaching myself MongoDB! Wanted to give myself the opportunity to build something with it, so I decided to take a project which I was a Team Lead on for Lambda School build weeks and create a new backend for it with Node, Express, and MongoDB! Also planning to implement a Redis cache and get this thing hosted on AWS just to stretch my abilities!

## DB Diagram

<img src="./dbdiagramimg/Screen Shot 2019-07-06 at 3.26.39 PM.png">

# Endpoints

## /api/auth/register

If no company_id is supplied, the API will assume that you're a new user, thus setting your account_type to 0 (unassigned). If a company_id is passed, the API will assume that youre a user being created for a company, and set your account_type to 1 (assigned). The third account_type, 2 (admin) is only assigned when creating a new company, or being assigned by a current company admin

### Required fields:

1. username
2. fullname
3. email
4. password

### Optional fields (only if also passing a company_id):

1. title
2. manager_id
3. department_id
4. company_id

## /api/auth/login

requires a username an a password, checks for pass word correctness, and sends back the users information, and JWT token, and all of assosciated company information. This uncludes an array of team mates, their departments, their managers, and an array of all departments, with the department heads information included.

## Contributing

Contact me.

## License

MIT © Thomas Hessburg
