# LAMovies Project
This is a Full Stack project consisting of three main components:

- Back-end: Provides API endpoints using ASP.NET CORE 7.0.
- Front-end Customer: Built with ReactJS, this part of the application is intended for general users or customers.
- Front-end Admin: Also developed with ReactJS, this portion of the project is designed for administrative purposes.
# Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed on your machine
- .NET 7.0 SDK installed on your machine
- Git installed on your machine
# Installation
To set up this project locally, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/AnhITT/LAMovies.git
```

2. Navigate into the project directory and restore dependencies and build the backend:

```bash
cd LAMovies_BE
dotnet restore
dotnet build
```
3. Navigate into the project directory and install frontend dependencies for customer:
```bash
cd lamovies_fe
npm install
```
4. Navigate into the project directory and install frontend dependencies for admin:
```bash
cd lamovies_fe_admin
npm install
```

# Usage
1. Backend Setup:

- Ensure SQL Server is installed and running.

- In the backend directory, change appsettings.json file with the following environment variables:
```bash
"ConnectionStrings": {
    "DefaultConnection": "Server=...; Database=...; Integrated Security=True;Encrypt=False"
  }
```
- Create a database in sql server with the same name as the environment variable above.
  
2. Starting the Backend:

- In the backend directory, run:

```bash
dotnet run
```
The backend should now be running at http://localhost:7279.

3. Frontend Setup:

- In both frontend_customer and frontend_admin directories, create a .env file with the following content:

```bash

REACT_APP_API_URL=http://localhost:7279/api
```
4. Starting the Frontend:

- For customer frontend, in the frontend_customer directory, run:

```bash
npm start
```
- For admin frontend, in the frontend_admin directory, run:

```bash
npm start
```
5. Access the applications in your browser:

- Customer frontend: http://localhost:3000
- Admin frontend: http://localhost:3001
# Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request.

# License
This project is licensed under the MIT License.
