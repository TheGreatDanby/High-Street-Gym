# High Street Gym Dynamic Website Project

This repository contains a school project focused on developing a dynamic website for High Street Gym. The primary objective is to demonstrate the ability to design a website that interacts with a database using XML documents for data transfer.

## Project Overview

As a Web Designer/Developer at Uptown IT, this project simulates the creation of a dynamic website for High Street Gym to manage class bookings and user interactions. The website features user authentication, a class calendar, booking functionalities, and a members' blog.

## Features

- **User Authentication**: Includes sign-up, login, and user account management.
- **Gym Classes Calendar**: Displays a schedule of gym classes, allowing users to view available sessions.
- **Class Booking System**: Enables users to book classes, select trainers, and choose session times.
- **Members' Blog**: A platform for members to upload and read messages, fostering community interaction.

## XML Integration

- The project requires the creation and parsing of at least two XML documents to transfer data to the database, such as adding new classes or members.

## Database Design

The database is structured to store information about users, classes, trainers, and the class schedule:

- **Users**: Stores member details like first name, last name, email, and phone number.
- **Classes/Activities**: Includes details like class name, description, location, occupancy, and trainer ID.
- **Class Calendar/Timetable**: Maintains the schedule with details like weekday, time, duration, and class level.
- **Trainers**: Contains trainer information including first name, last name, email, and phone number.

## Technologies

### Backend

- **Node.js**: The core environment for the backend.
- **Express**: A fast, unopinionated, minimalist web framework for Node.js, used to build the server-side of the application.
- **MongoDB**: The NoSQL database used to store user and class information.
- **Bcryptjs**: Used for hashing and securing user passwords.
- **Body-parser**: Middleware to handle JSON, Raw, Text, and URL encoded form data.
- **Cors**: Package to enable CORS (Cross-Origin Resource Sharing).
- **Dayjs**: Lightweight JavaScript date library for parsing, validating, manipulating, and formatting dates.
- **Dotenv**: Module to load environment variables from a `.env` file.
- **Express-fileupload**: Middleware for handling file uploads.
- **Express-json-validator-middleware**: Middleware for JSON validation.
- **Jsonwebtoken**: Implementation of JSON Web Tokens for authentication.
- **React-select**: Used for building select input components.
- **Swagger-ui-express**: Middleware for serving the Swagger UI for API documentation.
- **Uuid**: For the generation of RFC4122 UUIDs.
- **Xml2js**: Library for parsing XML to JavaScript objects.
- **Nodemon** (Dev Dependency): Utility that monitors for any changes in your source and automatically restarts your server.
- **Swagger-autogen** (Dev Dependency): Tool for auto-generating Swagger documentation.

### Frontend 

- **React**: A JavaScript library for building user interfaces.
- **Axios**: Promise-based HTTP client for the browser and Node.js.
- **Dayjs**: Lightweight library for parsing, validating, manipulating, and formatting dates.
- **React-icons**: Library to include popular icons in your React projects.
- **React-router-dom**: DOM bindings for React Router, used for routing in this application.
- **React-select**: Component for creating select dropdowns.
- **Sweetalert2**: A beautiful, responsive, customizable, and accessible replacement for JavaScript's popup boxes.
- **Vite**: Frontend build tool that significantly improves the frontend development experience.
- **DaisyUI**: Tailwind CSS component library.
- **TailwindCSS**: A utility-first CSS framework for rapidly building custom designs.
- **PostCSS**: A tool for transforming CSS with JavaScript.
- **Autoprefixer**: PostCSS plugin to parse CSS and add vendor prefixes to CSS rules.
- **@types/react** and **@types/react-dom** (Dev Dependencies): TypeScript definitions for React and React DOM.
- **@vitejs/plugin-react**: Enables Vite to work with React.

This setup provides a robust development environment for building and maintaining the dynamic website for High Street Gym, demonstrating a range of modern web development tools and practices.


## Contributing

This project is designed for educational purposes. Suggestions for enhancements or improvements are welcome for academic exploration.

## License

This project is created for demonstration and educational use and is not intended for commercial deployment.
