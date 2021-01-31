## Route
- Get localhost:3001/
- Post localhost:3001/register
    - firstname: string
	- lastname: string
	- email: string
	- password1: string
	- password2: string
	- phone_number: integer
	- address: string
- Post localhost:3001/login (return token)
    - email: string
    - password: string
- Post localhost:3001/create/task (auth)
    - title: string
    - task: string

## Auth
For authorize user you must include this header in your request
```bash
authorization: Bearer 'token'
```