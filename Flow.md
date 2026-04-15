# ReBook Project Flow (Easy Urdu)

## 1) Project Ka Basic Idea
- Yeh project old books buy/sell/exchange marketplace hai.
- User account bana sakta hai, login kar sakta hai, books upload kar sakta hai, books browse kar sakta hai, cart/checkout se order place kar sakta hai.
- Backend API provide karta hai aur frontend UI/user experience handle karta hai.

## 2) High-Level Architecture
- Frontend React app hai jo API calls karta hai.
- Backend Node.js + Express app hai jo MongoDB se data read/write karta hai.
- Authentication JWT token + cookie/header dono support ke sath ho rahi hai.
- Images local uploads folder mein store hoti hain.

## 3) Backend Concepts (Alag Se)
- REST API design:
	- Routes user, book, order, category ke liye defined hain.
- Express middleware pattern:
	- JSON parsing, cookies, CORS, error middleware.
- Database connection:
	- MongoDB connection logic.
- Authentication:
	- JWT verify + req.user attach.
- Async error handling:
	- Wrapper middleware for try/catch pattern.
- Centralized error handling:
	- Global error middleware.
- Custom Error class:
	- Standard error response structure.
- Token response helper:
	- Cookie + token return helper.
- File upload:
	- Multer disk storage.
- Email sending:
	- Nodemailer Gmail setup.
- Mongoose models and relations:
	- User, Book, Category, Order, Cart, Wishlist, ExchangeRequest.
- Seeder concept:
	- Initial data load script.

## 4) Backend Folder Structure (Simple Explanation)
- Backend/server.js
	- App start karta hai, env load karta hai, DB connect karta hai.
- Backend/app.js
	- Express app configuration + route mounting.
- Backend/config
	- Environment config files.
- Backend/controller
	- Route handlers / business logic.
- Backend/db
	- Database connection logic.
- Backend/middleware
	- Auth, async catcher, global error handler.
- Backend/model
	- MongoDB schema/models.
- Backend/utils
	- Reusable helpers (error class, JWT, mail).
- Backend/seed
	- Test/demo data + seeding scripts.
- uploads
	- Uploaded images storage.

## 5) Backend Main Files Aur Role
- Backend/controller/user.js
	- Signup, login, get current user, avatar update/delete, profile update.
- Backend/controller/book.js
	- Book CRUD, search, category filter, my-books.
- Backend/controller/order.js
	- Order create, buyer/seller order lists, seller status update.
- Backend/controller/category.js
	- Categories list.

## 6) Frontend Concepts (Alag Se)
- React component architecture:
	- UI pages + reusable components.
- Client-side routing:
	- Public/protected/admin routes.
- Route protection:
	- Auth guard + admin role guard.
- State management:
	- Redux Toolkit for user auth state.
- Context API:
	- Cart and wishlist local state.
- Axios interceptors:
	- Token attach + 401 handling.
- Data normalization:
	- Backend book object ko UI shape mein map karna.
- UI feedback:
	- Toast notifications.
- Styling:
	- Tailwind CSS + custom styles.

## 7) Frontend Folder Structure (Simple Explanation)
- Frontend/src/index.js
	- App bootstrap + providers wrap.
- Frontend/src/App.js
	- App start pe loadUser call + global routes render.
- Frontend/src/routes
	- Routing and guards.
- Frontend/src/pages
	- Main pages (Home, Login, Signup, Cart, Checkout, Profile, Admin).
- Frontend/src/components
	- Reusable UI and feature components.
- Frontend/src/context
	- Cart/Wishlist state.
- Frontend/src/redux
	- Store + reducers/actions.
- Frontend/src/api
	- Axios API client.
- Frontend/src/utils
	- Helper functions.

## 8) Frontend Main Flows
- Auth flow:
	- Signup -> Login -> loadUser -> role based navigation.
- Browse + details:
	- Books listing -> search/filter -> product details -> related books.
- Cart + checkout:
	- Add to cart/buy now -> shipping -> place order.
- Profile dashboard:
	- Profile tabs, avatar update, books manage, buyer/seller orders.
- Header search/categories:
	- Live search + category dropdown integration.

## 9) End-to-End Functional Flow (Step by Step)
- User signup karta hai.
- Backend user create karta hai aur activation link email karta hai.
- User login karta hai, token milta hai, frontend token store karta hai.
- App load pe current user fetch hota hai.
- User books browse karta hai, search/filter karta hai.
- User book detail dekh kar cart ya buy now karta hai.
- Checkout pe shipping details deta hai.
- Backend order create karta hai aur book status Sold set karta hai.
- Seller profile section se order status update karta hai.
- User profile mein apni books manage (create/edit/delete) kar sakta hai.

## 10) Important Notes (Current Project Status)
- Activation route mismatch lag raha hai:
	- Frontend activation page mein /auth/activation call ho rahi hai.
	- Backend controllers mein activation endpoint nazar nahi aata.
- Exchange requests currently demo/static lagti hain:
	- Profile exchange component demo data use karti hai.
- Admin module mostly static data par chal raha hai:
	- Admin pages demo dataset use kar rahi hain.
- Sensitive env values plain text mein hain:
	- Production/public sharing se pehle secure handling zaroori hai.

## 11) Quick Folder Summary
- Backend = API + DB + auth + business logic.
- Frontend = UI + routing + state + API integration.
- uploads = images storage.
- seed = testing/demo initial data.
- plan files = project planning docs.
