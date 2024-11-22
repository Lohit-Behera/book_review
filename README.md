# Book Review

A full-stack book review platform where users can browse books, read and write reviews, and rate books. The application uses React for the frontend and Node.js with Express for the backend, with MongoDB for data persistence.

---

## Features

### Frontend

- **Home Page**: Displays sort books.
- **Individual Book Page**: View book details, reviews, and ratings.
- **User Profile Page**: Manage user information and view user-specific data.
- **Review Submission Form**: Submit reviews for books.
- **State Management**: Redux for managing application state.
- **Routing**: React Router for seamless navigation.

### Backend

- **User Management**: Register, login, logout, update profiles, and grant admin privileges.
- **Book Management**: Add, retrieve, and manage book data.
- **Review Management**: Submit and view book reviews.
- **Secure APIs**: JWT-based authentication for user and admin roles.
- **Data Validation**: Ensures clean and valid input data.
- **Error Handling**: Graceful error responses and robust middleware.

---

## API Endpoints

### User Endpoints

| Method | Endpoint                        | Description                      |
| ------ | ------------------------------- | -------------------------------- |
| POST   | `/api/v1/users/register`        | Register a new user              |
| POST   | `/api/v1/users/login`           | Login a user                     |
| GET    | `/api/v1/users/logout`          | Logout the user                  |
| GET    | `/api/v1/users/details`         | Get logged-in user details       |
| GET    | `/api/v1/users/profile/:userId` | Get details of a specific user   |
| PATCH  | `/api/v1/users/update`          | Update user details              |
| PATCH  | `/api/v1/users/update/password` | Update user password             |
| PATCH  | `/api/v1/users/admin`           | Grant admin privileges to a user |

### Book Endpoints

| Method | Endpoint                    | Description                    |
| ------ | --------------------------- | ------------------------------ |
| GET    | `/api/v1/books/get/:bookId` | Get details of a specific book |
| GET    | `/api/v1/books/all`         | Get all books (paginated)      |
| POST   | `/api/v1/books/create`      | Add a new book (Admin only)    |

### Review Endpoints

| Method | Endpoint                      | Description                     |
| ------ | ----------------------------- | ------------------------------- |
| POST   | `/api/v1/reviews/create`      | Submit a new review             |
| GET    | `/api/v1/reviews/get/:bookId` | Get reviews for a specific book |

---

## Technology Stack

### Frontend

- React.js
- Redux for state management
- React Router for navigation
- Tailwind CSS for styling

### Backend

- Node.js with Express.js
- MongoDB for database
- JWT for authentication
- Cookie Parser and CORS middleware

---

## Getting Started

### Prerequisites

- Node.js (18+ recommended)
- MongoDB
- npm or yarn package manager

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file. If you are using Docker, you can change .env.sample to .env.

In backend Folder

`PORT`
`CORS_ORIGIN`
`MONGODB_URI`
`ACCESS_TOKEN_SECRET`
`ACCESS_TOKEN_EXPIRY`
`REFRESH_TOKEN_SECRET`
`REFRESH_TOKEN_EXPIRY`

In frontend Folder

`VITE_BASE_URL`

## Run Locally

Clone the repository:

```bash
  git clone https://github.com/Lohit-Behera/book_review.git
  cd book_review
```

**Running using [Docker](https://www.docker.com/)**

in root directory

```bash
  docker compose up
```

Then go to [localhost:5173](http://localhost:5173/) for frontend and [localhost:8000](http://localhost:8000/) for backend

**Running without Docker**

change directory to backend

```bash
  cd backend
```

Install node modules

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

Then go to [http://localhost:8000](http://localhost:8000)

In another terminal for React js

Now change directory to frontend

```bash
  cd book_review
  cd frontend
```

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

Then go to [http://localhost:5173](http://localhost:5173)
