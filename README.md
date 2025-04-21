# Social Network API  
**Live Demo:**  
*This app is backend-only and can be tested using Postman, Insomnia, or similar API tools.*

This is a RESTful social network API that lets users sign up, add friends, post thoughts, and react to other users' thoughts. It's built with Express and Mongoose and designed for developers looking to test or build upon a simple social backend.

---

## License  
This project is licensed under the MIT License.

---

## Table of Contents  
- [Features](#features)  
- [Installation](#installation)  
- [Technologies Used](#technologies-used)  
- [License](#license)  

---

## Features  

### Users  
- Create, read, update, and delete users  
- Add or remove friends from a user’s friend list  

### Thoughts  
- Create, read, update, and delete thoughts  
- Each thought is tied to a user  

### Reactions  
- React to thoughts with simple emoji-style reactions  
- Reactions can be added or removed by other users  

### API-Only  
- No frontend included  
- Easily test endpoints using Postman or Insomnia  
- Well-structured routes for easy expandability  

---

## Installation  

**Clone the repository:**  
```bash
git clone https://github.com/your-username/social-network-api.git
```

**Navigate into the project directory:**  
```bash
cd social-network-api
```

**Install dependencies:**  
```bash
npm install
```

**Set environment variables (optional):**  
If needed, create a `.env` file in the root directory. You can include values such as:  
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/socialNetworkDB
```

**Start the server:**  
```bash
npm start
```

---

## Technologies Used  

- Node.js (Runtime Environment)  
- Express (Web Framework)  
- MongoDB + Mongoose (Database and ODM)  
- JavaScript (Language)  
- Postman / Insomnia (API Testing Tools)  

---

## License  
This project is licensed under the MIT License.
