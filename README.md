# Recipe Explorer – Scalable Culinary Discovery App

**Recipe Explorer** is a fullstack MERN application designed for food lovers to explore 5000+ dishes with detailed recipe views, authentication, and personalization.  
Users can browse recipes, save favorites, and enjoy a smooth cooking journey with responsive design and efficient pagination.  

---

## ✨ Features

- 🍲 **Browse 5000+ Recipes** – Wide collection of culinary dishes  
- 🔑 **User Authentication** – Secure login and signup  
- ❤️ **Personalized Favorites** – Save your favorite recipes for later  
- 📑 **Detailed Recipe Views** – Step-by-step instructions with ingredients  
- 📄 **Pagination Support** – Efficient browsing of thousands of recipes  
- 🎨 **Responsive UI** – Optimized for desktop and mobile devices  

---

## 🛠 Tech Stack

- **Frontend:** React.js (Redux for state management)  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Authentication:** JWT (JSON Web Tokens)  
- **Deployment:** Netlify (Frontend), Render (Backend)  

---

## 🚀 Getting Started

### ✅ Prerequisites
- [Node.js](https://nodejs.org/) installed  
- [MongoDB](https://www.mongodb.com/) running locally or via MongoDB Atlas  

---

### ⚙️ Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shivam20242/Recipe.git
   cd Recipe
2.Install dependencies for both frontend & backend:

bash
Copy code
cd client
npm install
cd ../server
npm install
3.Set up environment variables:
Create a .env file in the server folder and add:

env
Copy code
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
Run the backend server:

bash
Copy code
cd server
npm run dev
Run the frontend app:

bash
Copy code
cd client
npm start
💻 Usage
Register or log in to your account

Browse recipes using pagination

Click on a recipe to view details with ingredients and steps

Save favorite recipes to your personal collection

Enjoy a smooth, responsive experience across devices

📂 Project Structure
bash
Copy code
Recipe/
│── client/         # React frontend
│── server/         # Node.js + Express.js backend
│── models/         # MongoDB schemas
│── routes/         # API endpoints
│── controllers/    # Business logic for recipes & auth
│── .env            # Environment variables
│── package.json
🔮 Future Enhancements
🔍 Advanced recipe search with filters (cuisine, diet, time)

🧑‍🍳 User-submitted recipes with ratings

📊 Nutrition info integration for recipes

📱 Mobile app version with React Native

🌐 Live Demo & GitHub
Live: Recipe Explorer(https://food-recipe-web5000.netlify.app)
