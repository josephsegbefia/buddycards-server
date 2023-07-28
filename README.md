# Flashcard App

## Overview

The Flashcard App is a language learning tool that allows users to create, manage, and practice with flashcards. Users can create flashcards with German words and their English translations, and they can also view and practice with the flashcards they have created.

## Features

- User Authentication: Users can sign up and log in to the app using their email and password. User authentication is handled securely using JSON Web Tokens (JWT).
- Create Flashcards: Authenticated users can create new flashcards by entering a German word and its English translation.
- View Flashcards: Users can view all the flashcards they have created in a list format with the German word and its translation displayed.
- Edit Flashcards: Users can edit the translations of their existing flashcards.
- Delete Flashcards: Users can delete flashcards they no longer need.
- Practice Mode: Users can practice with their flashcards in practice mode. In this mode, the app presents a flashcard with a German word, and the user needs to provide the English translation. The app then provides feedback on whether the answer was correct or not.

## Tech Stack

The Flashcard App is built using the following technologies:

- Frontend:

  - React: A JavaScript library for building user interfaces.
  - React Router: For handling routing within the app.
  - Axios: For making HTTP requests to the backend API.
  - Styled Components: For styling the components in a modular and maintainable way.

- Backend:

  - Node.js: A JavaScript runtime for building server-side applications.
  - Express: A web framework for Node.js.
  - MongoDB: A NoSQL database for storing the flashcard data.
  - Mongoose: An Object Data Modeling (ODM) library for MongoDB.

- Authentication:
  - JSON Web Tokens (JWT): For securely handling user authentication and authorization.

## Getting Started

To run the Flashcard App locally, follow these steps:

1. Clone the repository:

```bash
git clone <repository-url>
```

2. Navigate to the project directory:

```bash
cd flashcard-app
```

3. Install the dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm start
```

The app should now be running at `http://localhost:3000/`.

## Folder Structure

The project's folder structure is organized as follows:

- `/src`: Contains the frontend source code.

  - `/components`: Contains reusable React components.
  - `/pages`: Contains the main pages of the app.
  - `/context`: Contains the AuthContext for handling user authentication.
  - `/services`: Contains utility functions for making API requests.
  - `/styles`: Contains global styles and styled components.
  - `/App.js`: The main entry point of the frontend application.

- `/server`: Contains the backend source code.
  - `/models`: Contains the Mongoose models for the flashcard data.
  - `/routes`: Contains the API routes for handling flashcard operations.
  - `/config`: Contains configuration files for MongoDB and JWT.
  - `/middleware`: Contains middleware functions for authentication.
  - `/index.js`: The main entry point of the backend application.

## API Endpoints

The backend API provides the following endpoints for interacting with the flashcards:

- `GET /api/users/:userId/flashcards`: Get all flashcards for a specific user.
- `POST /api/users/:userId/flashcards`: Create a new flashcard for a specific user.
- `GET /api/users/:userId/flashcards/:flashcardId`: Get a specific flashcard for a user.
- `PUT /api/users/:userId/flashcards/:flashcardId`: Update the translation of a flashcard.
- `DELETE /api/users/:userId/flashcards/:flashcardId`: Delete a flashcard.

## Future Enhancements

Here are some ideas for future enhancements to the Flashcard App:

- Implement pagination on the flashcard list page to handle large numbers of flashcards.
- Add the ability to filter flashcards by tags or categories.
- Create a dashboard to display user statistics and progress in learning.
- Implement more interactive practice modes, such as multiple-choice quizzes.
- Add support for multiple languages and translations.
- Implement a feature to import/export flashcards in different formats.

## Acknowledgments

The Flashcard App was developed as a learning project and was inspired by various tutorials and examples on React, Node.js, and MongoDB.

## License
