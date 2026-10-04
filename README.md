# TripNova

TripNova is a full-stack travel listing platform that allows users to explore destinations, create and manage travel listings, upload images, and share reviews.

## Features

* User registration and login
* Create, edit, and delete travel listings
* Browse and view detailed travel listings
* Upload listing images using Cloudinary
* Add and delete reviews
* Authentication and authorization
* Session-based user management
* Responsive and user-friendly interface

## Tech Stack

* **Frontend:** HTML, CSS, JavaScript, EJS, Bootstrap
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas, Mongoose
* **Authentication:** Passport.js, Express Session, Connect-Mongo
* **Image Storage:** Cloudinary, Multer
* **Validation:** Joi
* **Deployment:** Railway

## Project Structure

```text
TripNova/
├── controllers/
├── models/
├── routes/
├── views/
├── public/
├── utils/
├── middleware.js
├── app.js
├── package.json
└── .env
```

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/KoushikeeTomar/MajorProject.git
cd MajorProject
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
ATLASDB_URL=your_mongodb_connection_string
SECRET=your_session_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
```

### 4. Run the Application

```bash
node app.js
```

The application will start on the configured local port.

## Key Highlights

* Developed a full-stack travel listing application using the MVC architecture
* Implemented authentication and authorization using Passport.js
* Integrated MongoDB Atlas for persistent data storage
* Implemented CRUD operations for travel listings
* Integrated Cloudinary for image uploads and storage
* Added a review system with user-based authorization
* Implemented session management using MongoDB
* Built a responsive interface using EJS and Bootstrap

## Future Enhancements

* Interactive maps and location-based features
* Advanced search and filtering
* Wishlist functionality
* Saved trips
* User profiles
* Travel itinerary management

## Author

**Koushikee Tomar**

B.Tech Computer Science and Engineering

**GitHub:** [KoushikeeTomar](https://github.com/KoushikeeTomar)
