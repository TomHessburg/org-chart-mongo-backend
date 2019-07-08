# org-shart-mongo-backend

> Spent the last several days teaching myself MongoDB and Redis Caching! Wanted to give myself the opportunity to build something with it, so I decided to take a project which I had been a Team Lead on (for Lambda School build weeks) and create a new backend for it with Node, Express, Redis, and MongoDB!

## DB Diagram

<img src="./dbdiagramimg/Screen Shot 2019-07-06 at 3.26.39 PM.png">

# Endpoints

## authentication/registration

### POST: /api/auth/register

> If no company_id is supplied, the API will assume that you're a new user, thus setting your account_type to 0 (unassigned). If a company_id is passed, the API will assume that youre a user being created for a company, and set your account_type to 1 (assigned). The third account_type, 2 (admin) is only assigned when creating a new company, or being assigned by a current company admin

#### Required fields:

1. username
2. fullname
3. email
4. password

#### Optional fields (only if also passing a company_id):

1. title
2. manager_id
3. department_id
4. company_id

### POST: /api/auth/login

> requires a username an a password, checks for pass word correctness, and sends back the users information, and JWT token, and all of assosciated company information. This uncludes an array of team mates, their departments, their managers, and an array of all departments, with the department heads information included.

#### all endpoints from here are protected and require a valid JWT recieved on login

## users

### GET: /api/user/:id

> get a specific user by ID

### GET: /api/user/company/:id

> get all users for a company base on a company ID

### PUT: /api/user/:id

> update a specific user by ID

### DELETE: /api/user/:id

> update a specific user by ID

## departments

### GET: /api/departments/:id

> get a specific department with the info on the head user

### GET: /api/departments/company/:id

> get a specific companies departments and their heads

### PUT: /api/departments/:id

> update a department. If the update includes the head of a department, the user who has become the head of the department will be updated to to have their department_id === updated departments id

### DELETE: /api/departments/:id

> Delete a department and updates all users who were a part of that department to have a department_id of null

### POST: /api/departments/

> Add a new department. Must include a department_head ID. The user set to become the department head will automatically be updated to have a department_id = to the new department

## Companies

### GET: /api/companies/

> Returns all companies

### GET: /api/companies/:id

> Returns a specific company

### POST: /api/companies/

> Creates a new company. Must include the id of the user creating the company as 'user_id', this user will be assigned as the manager of this company.

### PUT: /api/companies/:id

> Update a company by id.

### DELETE: /api/companies/:id

> Deletes a company by ID, and removes/initializes all users.

## Requests

### GET: /api/requests/:id

> Get a specific request by id

### GET: /api/requests/recipient/:id

> Get all requests by recipient id

### GET: /api/requests/sender/:id

> Get all requests by sender id

### POST: /api/requests

> Post a new request

### PUT: /api/requests/:id

> Update a new request by request ID

### delete: /api/requests/:id

> Delete a request by ID

---

---

---

## Contributing

Contact me.

## License

MIT © Thomas Hessburg
