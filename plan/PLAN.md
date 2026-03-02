# ReBook - Implementation Plan

## Context
ReBook is an old books buy-and-exchange marketplace built with the MERN stack (MongoDB, Express.js, React.js, Node.js). Users can buy, sell, and exchange books. There are two roles: User (buyer/seller on same portal) and Admin (super admin). This plan covers the full implementation from scratch, split into Backend and Frontend parts with incremental phases.

---

# PART 1: BACKEND

## Phase B1: Project Setup & Configuration

### B1.1 — Initialize Node.js Project
- `npm init` in `/Backend`
- Install core dependencies:
  - `express` (latest) — web framework
  - `mongoose` (latest) — MongoDB ODM
  - `dotenv` — environment variables
  - `cors` — cross-origin requests
  - `bcryptjs` — password hashing
  - `jsonwebtoken` — JWT auth tokens
  - `multer` — file uploads (book images, profile images)
  - `express-validator` — request validation
  - `nodemailer` — sending reset password emails
  - `cookie-parser` — cookie handling
- Install dev dependencies:
  - `nodemon` — auto-restart on changes

### B1.2 — Project Folder Structure
```
Backend/
├── config/
│   └── db.js                  # MongoDB connection
├── models/
│   ├── User.js
│   ├── Book.js
│   ├── Order.js
│   ├── ExchangeRequest.js
│   ├── Category.js
│   ├── Wishlist.js
│   └── Cart.js
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── bookRoutes.js
│   ├── orderRoutes.js
│   ├── exchangeRoutes.js
│   ├── categoryRoutes.js
│   ├── wishlistRoutes.js
│   └── cartRoutes.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── bookController.js
│   ├── orderController.js
│   ├── exchangeController.js
│   ├── categoryController.js
│   ├── wishlistController.js
│   └── cartController.js
├── middleware/
│   ├── authMiddleware.js      # JWT verification, role check
│   ├── uploadMiddleware.js    # Multer config for image uploads
│   └── errorMiddleware.js     # Global error handler
├── utils/
│   ├── sendEmail.js           # Nodemailer helper
│   └── validators.js          # Reusable validation chains
├── uploads/                   # Uploaded images directory
├── .env
├── .env.example
├── server.js                  # Entry point
└── package.json
```

### B1.3 — Environment Variables (`.env`)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/rebook
JWT_SECRET=<random_secret>
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=<email>
EMAIL_PASS=<app_password>
CLIENT_URL=http://localhost:5173
```

### B1.4 — Database Connection (`config/db.js`)
- Connect to MongoDB using Mongoose
- Log success/failure
- Call from `server.js` on app startup

### B1.5 — Server Entry Point (`server.js`)
- Load env vars, connect DB
- Apply middleware: `cors`, `express.json()`, `cookie-parser`, static files for `/uploads`
- Mount all route files
- Apply global error handler
- Listen on `PORT`

---

## Phase B2: Models (Mongoose Schemas)

### B2.1 — User Model (`models/User.js`)
```
Fields:
  name:           String, required, trim
  email:          String, required, unique, lowercase, trim
  password:       String, required, minlength 6 (stored hashed)
  role:           String, enum ['user', 'admin'], default 'user'
  phone:          String, default ''
  address:        String, default ''
  profileImage:   String, default '' (file path)
  createdAt:      Date, default Date.now
  updatedAt:      Date, default Date.now

Pre-save hook: hash password with bcryptjs (only if modified)
Instance method: matchPassword(enteredPassword) → bcrypt.compare
```

### B2.2 — Category Model (`models/Category.js`)
```
Fields:
  name:       String, required, unique, trim
  createdAt:  Date, default Date.now
```

### B2.3 — Book Model (`models/Book.js`)
```
Fields:
  user:          ObjectId, ref 'User', required (the seller)
  category:      ObjectId, ref 'Category', required
  title:         String, required, trim
  author:        String, required, trim
  description:   String, required
  edition:       String, default '' (optional)
  condition:     String, enum ['New', 'Good', 'Used'], required
  price:         Number, required, min 0
  image:         String, required (file path)
  exchangeable:  Boolean, default false
  status:        String, enum ['Under_Review', 'Rejected', 'Available', 'Reserved', 'Exchanged', 'Sold'], default 'Under_Review'
  createdAt:     Date, default Date.now
```

### B2.4 — Order Model (`models/Order.js`)
```
Fields:
  book:             ObjectId, ref 'Book', required
  buyer:            ObjectId, ref 'User', required
  seller:           ObjectId, ref 'User', required
  price:            Number, required
  status:           String, enum ['Pending', 'Shipped', 'Completed', 'Cancelled'], default 'Pending'
  shippingAddress:  String, required
  paymentMethod:    String, default 'COD'
  createdAt:        Date, default Date.now
```

### B2.5 — ExchangeRequest Model (`models/ExchangeRequest.js`)
```
Fields:
  requestedBook:  ObjectId, ref 'Book', required (book the requester wants)
  offeredBook:    ObjectId, ref 'Book', required (book the requester offers)
  requester:      ObjectId, ref 'User', required (who sent the request)
  owner:          ObjectId, ref 'User', required (owner of the requested book)
  status:         String, enum ['Pending', 'Accepted', 'Rejected', 'Exchanged', 'Cancelled'], default 'Pending'
  createdAt:      Date, default Date.now
```

### B2.6 — Wishlist Model (`models/Wishlist.js`)
```
Fields:
  user:       ObjectId, ref 'User', required
  book:       ObjectId, ref 'Book', required
  createdAt:  Date, default Date.now

Compound unique index: { user: 1, book: 1 } — prevents duplicate entries
```

### B2.7 — Cart Model (`models/Cart.js`)
```
Fields:
  user:       ObjectId, ref 'User', required
  book:       ObjectId, ref 'Book', required
  createdAt:  Date, default Date.now

Compound unique index: { user: 1, book: 1 } — prevents duplicate entries
```

---

## Phase B3: Middleware

### B3.1 — Auth Middleware (`middleware/authMiddleware.js`)
- `protect`: Extract JWT from `Authorization: Bearer <token>` header → verify → attach `req.user` (full user doc from DB minus password)
- `authorize(...roles)`: Check `req.user.role` against allowed roles → 403 if not permitted

### B3.2 — Upload Middleware (`middleware/uploadMiddleware.js`)
- Configure Multer with disk storage
- Destination: `uploads/`
- Filename: `Date.now()-originalname`
- File filter: accept only image types (jpeg, jpg, png, webp)
- Max file size: 5MB
- Export as reusable middleware: `uploadSingle('image')`

### B3.3 — Error Middleware (`middleware/errorMiddleware.js`)
- Global error handler: catch all errors, return consistent JSON `{ success: false, message }`
- Handle Mongoose validation errors, duplicate key errors, cast errors
- 404 not-found handler for undefined routes

---

## Phase B4: Auth Routes & Controllers

### B4.1 — POST `/api/auth/register`
- Validate: name (required), email (required, valid format), password (required, min 6), confirmPassword (must match)
- Check if email already exists → 400
- Create user (role defaults to 'user')
- Handle optional profileImage upload (Multer)
- Return JWT token + user data (exclude password)

### B4.2 — POST `/api/auth/login`
- Validate: email (required), password (required)
- Find user by email → 401 if not found
- Compare password → 401 if wrong
- Return JWT token + user data (include role for frontend redirect)

### B4.3 — POST `/api/auth/forgot-password`
- Validate: email (required)
- Find user by email → 404 if not found
- Generate a reset token (JWT with short expiry, e.g. 15 min, or crypto random token stored in DB)
- Approach: Generate a JWT containing userId, sign with a secret composed of `JWT_SECRET + user's current hashed password` (so it becomes invalid once password changes), expiry 15 minutes
- Build reset URL: `CLIENT_URL/reset-password/:userId/:token`
- Send email via Nodemailer with the reset link
- Return success message

### B4.4 — POST `/api/auth/reset-password/:userId/:token`
- Validate: newPassword (required, min 6), confirmPassword (must match)
- Find user by userId → 404 if not found
- Verify token using `JWT_SECRET + user's current hashed password` → 400 if invalid/expired
- Update user's password (pre-save hook will hash it)
- Return success message, redirect to login on frontend

### B4.5 — GET `/api/auth/me`
- Protected route (requires `protect` middleware)
- Return current logged-in user's data from `req.user`

---

## Phase B5: User Routes & Controllers

### B5.1 — GET `/api/users/profile` (Protected)
- Return `req.user` full profile

### B5.2 — PUT `/api/users/profile` (Protected)
- Editable fields: name, phone, address, profileImage
- Handle optional profileImage upload: if new image uploaded, delete old image file from disk (if exists)
- Email and password are NOT editable here (email is login identity; password change could be a separate feature later)
- Validate fields, update user, return updated user

### B5.3 — GET `/api/users` (Admin only)
- Return all users (paginated)
- Admin can view all registered users

### B5.4 — DELETE `/api/users/:id` (Admin only)
- Check if user has related books, orders, or exchange requests → if yes, deny deletion with message
- Otherwise delete user

---

## Phase B6: Category Routes & Controllers (Admin only)

### B6.1 — POST `/api/categories` (Admin)
- Validate: name (required, unique)
- Create category, return it

### B6.2 — GET `/api/categories` (Public)
- Return all categories (no pagination needed, likely small list)
- Used by frontend for dropdowns and filters

### B6.3 — PUT `/api/categories/:id` (Admin)
- Validate: name (required, unique)
- Update category name

### B6.4 — DELETE `/api/categories/:id` (Admin)
- Check if any books reference this category → if yes, deny deletion with message "Cannot delete category that has books assigned"
- Otherwise delete

---

## Phase B7: Book Routes & Controllers

### B7.1 — POST `/api/books` (Protected - User)
- Multer middleware for image upload (required)
- Validate: title, author, description, price, category, condition (all required), exchangeable (boolean)
- Set `user` to `req.user._id`
- Set `status` to `Under_Review`
- Create book, return it

### B7.2 — GET `/api/books` (Public)
- Return all books where `status = 'Available'`
- Exclude books owned by the logged-in user (if authenticated, use optional auth middleware that attaches user if token present but doesn't block if absent)
- Support query params:
  - `search` — search by title (case-insensitive regex)
  - `category` — filter by category ID
  - `condition` — filter by condition
  - `minPrice`, `maxPrice` — price range filter
  - `exchangeable` — filter exchangeable books
  - `page`, `limit` — pagination (default page=1, limit=12)
  - `sort` — sort options (newest, price_asc, price_desc)
- Populate user (name, profileImage) and category (name)

### B7.3 — GET `/api/books/:id` (Public)
- Return single book by ID
- Populate user (name, email, phone, address, profileImage) and category (name)
- Used for Book Details page

### B7.4 — GET `/api/books/my-books` (Protected)
- Return all books posted by `req.user._id` (all statuses)
- Used for User Dashboard → My Books section

### B7.5 — PUT `/api/books/:id` (Protected - Owner only)
- Verify `req.user._id === book.user`
- Editable fields: title, description, author, price, edition, exchangeable, condition, image
- Handle optional image re-upload (delete old image)
- Book can only be edited if status is `Under_Review`, `Rejected`, or `Available` (not when Reserved/Sold/Exchanged)
- If edited after rejection, reset status back to `Under_Review`
- Return updated book

### B7.6 — DELETE `/api/books/:id` (Protected - Owner only)
- Verify `req.user._id === book.user`
- Check if book is involved in any active order (status Pending/Shipped) or active exchange request (status Pending/Accepted) → deny deletion with message
- If no active references: delete book, remove image file from disk, remove related wishlist and cart entries
- Return success

### B7.7 — PUT `/api/books/:id/review` (Admin only)
- Admin approves or rejects a book
- Body: `{ status: 'Available' | 'Rejected' }`
- Validate the transition: only books with `Under_Review` status can be reviewed
- Return updated book

### B7.8 — GET `/api/books/under-review` (Admin only)
- Return all books with `status = 'Under_Review'`
- For admin panel book review queue

### B7.9 — GET `/api/books/all` (Admin only)
- Return all books regardless of status (admin oversight)
- Support pagination and filters

---

## Phase B8: Order Routes & Controllers

### B8.1 — POST `/api/orders` (Protected - Buyer)
- Validate: bookId (required), shippingAddress (required)
- Verify book exists, `status = 'Available'`
- Verify buyer is NOT the book owner
- Set: buyer = req.user._id, seller = book.user, price = book.price, paymentMethod = 'COD', status = 'Pending'
- Update book status to `Reserved`
- Remove book from all carts and wishlists (since it's now reserved)
- Create order, return it

### B8.2 — GET `/api/orders/placed` (Protected)
- Return all orders where `buyer = req.user._id`
- Populate book (title, image, price), seller (name)
- "Orders I placed" tab

### B8.3 — GET `/api/orders/received` (Protected)
- Return all orders where `seller = req.user._id`
- Populate book (title, image, price), buyer (name, address, phone)
- "Orders I received" tab

### B8.4 — GET `/api/orders/:id` (Protected)
- Return single order, verify requester is buyer or seller
- Full populate of book, buyer, seller

### B8.5 — PUT `/api/orders/:id/cancel` (Protected - Buyer only)
- Verify `req.user._id === order.buyer`
- Only cancellable if `status = 'Pending'`
- Update order status to `Cancelled`
- Update book status back to `Available`
- Return updated order

### B8.6 — PUT `/api/orders/:id/ship` (Protected - Seller only)
- Verify `req.user._id === order.seller`
- Only if `status = 'Pending'`
- Update status to `Shipped`
- Return updated order

### B8.7 — PUT `/api/orders/:id/complete` (Protected - Buyer only)
- Verify `req.user._id === order.buyer`
- Only if `status = 'Shipped'`
- Update order status to `Completed`
- Update book status to `Sold`
- Return updated order

---

## Phase B9: Exchange Request Routes & Controllers

### B9.1 — POST `/api/exchange-requests` (Protected)
- Validate: requestedBookId (required), offeredBookId (required)
- Verify requested book exists, `status = 'Available'`, `exchangeable = true`
- Verify offered book exists, `status = 'Available'`, belongs to `req.user._id`
- Verify requester is NOT the owner of the requested book
- Prevent duplicate pending request for same book pair
- Set: requester = req.user._id, owner = requestedBook.user, status = 'Pending'
- Create exchange request, return it

### B9.2 — GET `/api/exchange-requests/sent` (Protected)
- Return all exchange requests where `requester = req.user._id`
- Populate requestedBook, offeredBook, owner
- "Sent Requests" tab

### B9.3 — GET `/api/exchange-requests/received` (Protected)
- Return all exchange requests where `owner = req.user._id`
- Populate requestedBook, offeredBook, requester
- "Received Requests" tab

### B9.4 — PUT `/api/exchange-requests/:id/accept` (Protected - Owner only)
- Verify `req.user._id === exchangeRequest.owner`
- Only if `status = 'Pending'`
- Update status to `Accepted`
- Update both books' status to `Reserved`
- Cancel all other pending exchange requests involving either book
- Remove both books from all carts and wishlists
- Return updated request

### B9.5 — PUT `/api/exchange-requests/:id/reject` (Protected - Owner only)
- Verify `req.user._id === exchangeRequest.owner`
- Only if `status = 'Pending'`
- Update status to `Rejected`
- Return updated request

### B9.6 — PUT `/api/exchange-requests/:id/cancel` (Protected - Requester only)
- Verify `req.user._id === exchangeRequest.requester`
- Only if `status = 'Pending'`
- Update status to `Cancelled`
- Return updated request

### B9.7 — PUT `/api/exchange-requests/:id/complete` (Protected - Requester OR Owner)
- Verify requester is either the requester or owner
- Only if `status = 'Accepted'`
- Update status to `Exchanged`
- Update both books' status to `Exchanged`
- This action is IRREVERSIBLE (cannot be reverted once exchanged)
- Return updated request

---

## Phase B10: Wishlist Routes & Controllers

### B10.1 — POST `/api/wishlist` (Protected)
- Validate: bookId (required)
- Verify book exists, `status = 'Available'`
- Verify user is NOT the book owner
- Check compound uniqueness (user + book) → 400 if already in wishlist
- Create wishlist entry, return it

### B10.2 — GET `/api/wishlist` (Protected)
- Return all wishlist items for `req.user._id`
- Populate book (title, author, price, image, status, condition)

### B10.3 — DELETE `/api/wishlist/:id` (Protected)
- Verify wishlist item belongs to `req.user._id`
- Delete entry

### B10.4 — GET `/api/wishlist/check/:bookId` (Protected)
- Return `{ inWishlist: true/false }` for the current user + given book
- Used by frontend to show filled/unfilled heart icon

---

## Phase B11: Cart Routes & Controllers

### B11.1 — POST `/api/cart` (Protected)
- Validate: bookId (required)
- Verify book exists, `status = 'Available'`
- Verify user is NOT the book owner
- Check compound uniqueness (user + book) → 400 if already in cart
- Create cart entry, return it

### B11.2 — GET `/api/cart` (Protected)
- Return all cart items for `req.user._id`
- Populate book (title, author, price, image, status, condition, exchangeable, user)

### B11.3 — DELETE `/api/cart/:id` (Protected)
- Verify cart item belongs to `req.user._id`
- Delete entry

### B11.4 — GET `/api/cart/check/:bookId` (Protected)
- Return `{ inCart: true/false }` for the current user + given book

---

## Phase B12: Admin Panel APIs

### B12.1 — GET `/api/admin/dashboard` (Admin)
- Return dashboard stats:
  - Total users count
  - Total books count (by status breakdown)
  - Total orders count (by status breakdown)
  - Total exchange requests count
  - Recent orders (last 10)
  - Books pending review count

### B12.2 — GET `/api/admin/users` (Admin)
- Paginated list of all users
- Search by name/email

### B12.3 — GET `/api/admin/orders` (Admin)
- Paginated list of all orders
- Filter by status

### B12.4 — GET `/api/admin/exchange-requests` (Admin)
- Paginated list of all exchange requests
- Filter by status

---

# PART 2: FRONTEND

## Phase F1: Project Setup & Configuration

### F1.1 — Initialize React Project
- Create with Vite: `npm create vite@latest Frontend -- --template react`
- Install dependencies:
  - `react-router-dom` — routing
  - `axios` — HTTP client
  - `react-toastify` — toast notifications
  - `react-icons` — icon library
  - `tailwindcss` + `@tailwindcss/vite` — styling (latest v4)

### F1.2 — Project Folder Structure
```
Frontend/
├── public/
├── src/
│   ├── api/
│   │   └── axios.js               # Axios instance with baseURL, interceptors
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── ConfirmModal.jsx
│   │   │   └── Pagination.jsx
│   │   ├── books/
│   │   │   ├── BookCard.jsx
│   │   │   └── BookFilter.jsx
│   │   ├── dashboard/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ProfileSection.jsx
│   │   │   ├── MyBooks.jsx
│   │   │   ├── AddBookForm.jsx
│   │   │   ├── EditBookForm.jsx
│   │   │   ├── OrdersPlaced.jsx
│   │   │   ├── OrdersReceived.jsx
│   │   │   ├── ExchangeSent.jsx
│   │   │   └── ExchangeReceived.jsx
│   │   └── admin/
│   │       ├── AdminSidebar.jsx
│   │       ├── AdminDashboardStats.jsx
│   │       ├── BookReviewQueue.jsx
│   │       ├── ManageCategories.jsx
│   │       └── ManageUsers.jsx
│   ├── context/
│   │   └── AuthContext.jsx         # Auth state, login, logout, token mgmt
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── ForgotPasswordPage.jsx
│   │   ├── ResetPasswordPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── BookDetailsPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── WishlistPage.jsx
│   │   ├── DashboardPage.jsx       # Wrapper with sidebar + outlet
│   │   ├── AdminDashboardPage.jsx   # Wrapper with admin sidebar + outlet
│   │   └── NotFoundPage.jsx
│   ├── routes/
│   │   ├── AppRoutes.jsx           # All route definitions
│   │   ├── ProtectedRoute.jsx      # Redirect to login if not auth'd
│   │   └── AdminRoute.jsx          # Redirect if not admin
│   ├── utils/
│   │   └── helpers.js              # formatDate, formatPrice, truncateText etc.
│   ├── App.jsx
│   ├── index.css                   # Tailwind imports
│   └── main.jsx
├── .env
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

### F1.3 — Axios Instance (`api/axios.js`)
- Base URL: `http://localhost:5000/api` (from env)
- Request interceptor: attach JWT from localStorage as `Authorization: Bearer <token>`
- Response interceptor: on 401, clear token and redirect to login

### F1.4 — Auth Context (`context/AuthContext.jsx`)
- State: `user`, `token`, `loading`
- On mount: check localStorage for token, if exists call `/api/auth/me` to validate and load user
- `login(email, password)` → call API, store token in localStorage, set user
- `register(formData)` → call API, store token, set user
- `logout()` → clear localStorage, set user null
- Provide `isAuthenticated`, `isAdmin` computed values

---

## Phase F2: Routing & Layout

### F2.1 — App Routes (`routes/AppRoutes.jsx`)
```
Public Routes:
  /login                    → LoginPage
  /signup                   → SignupPage
  /forgot-password          → ForgotPasswordPage
  /reset-password/:userId/:token → ResetPasswordPage
  /                         → HomePage
  /books/:id                → BookDetailsPage

Protected Routes (logged-in users):
  /cart                     → CartPage
  /checkout/:bookId         → CheckoutPage
  /wishlist                 → WishlistPage
  /dashboard                → DashboardPage (layout wrapper)
    /dashboard/profile      → ProfileSection
    /dashboard/books        → MyBooks
    /dashboard/books/add    → AddBookForm
    /dashboard/books/edit/:id → EditBookForm
    /dashboard/orders/placed    → OrdersPlaced
    /dashboard/orders/received  → OrdersReceived
    /dashboard/exchange/sent     → ExchangeSent
    /dashboard/exchange/received → ExchangeReceived

Admin Routes:
  /admin                    → AdminDashboardPage (layout wrapper)
    /admin/dashboard        → AdminDashboardStats
    /admin/books            → BookReviewQueue (+ view all books)
    /admin/categories       → ManageCategories
    /admin/users            → ManageUsers
    /admin/orders           → AdminOrders
    /admin/exchange-requests → AdminExchangeRequests

  /*                        → NotFoundPage
```

### F2.2 — ProtectedRoute Component
- Check `isAuthenticated` from AuthContext
- If not: redirect to `/login` with `state.from` for return redirect
- If yes: render `<Outlet />`

### F2.3 — AdminRoute Component
- Check `isAuthenticated && isAdmin`
- If not admin: redirect to `/`
- If not logged in: redirect to `/login`

### F2.4 — Navbar (`components/common/Navbar.jsx`)
- Logo/brand "ReBook" → links to `/`
- Search bar (search input → navigates to `/?search=term`)
- If NOT logged in: show `Login` | `Signup` buttons
- If logged in as User: show `Wishlist` icon (with count), `Cart` icon (with count), Profile dropdown (Dashboard, Logout)
- If logged in as Admin: show `Admin Panel` link, Profile dropdown (Dashboard, Logout)
- Logout shows confirmation dialog: "Are you sure you want to logout?"

---

## Phase F3: Auth Pages

### F3.1 — Login Page (`pages/LoginPage.jsx`)
- Form fields: Email, Password
- Frontend validation: email format, password not empty
- On submit: call `login()` from AuthContext
- On success: redirect based on role → admin goes to `/admin/dashboard`, user goes to `/`
- Show backend errors (invalid credentials, etc.) via toast
- Link to "Forgot Password?" → `/forgot-password`
- Link to "Don't have an account? Sign Up" → `/signup`

### F3.2 — Signup Page (`pages/SignupPage.jsx`)
- Form fields: Full Name, Email, Password, Confirm Password, Profile Image (optional file input)
- Frontend validation: name required, email format, password min 6 chars, passwords match
- On submit: call `register()` from AuthContext with FormData (for image)
- On success: redirect to `/`
- Link to "Already have an account? Login" → `/login`

### F3.3 — Forgot Password Page (`pages/ForgotPasswordPage.jsx`)
- Form: Email input + "Send Reset Link" button
- On submit: call `POST /api/auth/forgot-password`
- Show success toast: "Reset link sent to your email"
- Show error if email not found

### F3.4 — Reset Password Page (`pages/ResetPasswordPage.jsx`)
- URL params: `:userId`, `:token`
- Form: New Password, Confirm Password
- Frontend validation: min 6 chars, passwords match
- On submit: call `POST /api/auth/reset-password/:userId/:token`
- On success: toast "Password reset successful" → redirect to `/login`

---

## Phase F4: Home Page & Book Browsing

### F4.1 — Home Page (`pages/HomePage.jsx`)
- Hero/banner section (optional, simple welcome text or featured books)
- Category filter bar: horizontal list of categories (fetched from API), "All" selected by default, clicking a category filters books
- Search: controlled from Navbar search bar, reads from URL query params
- Book grid: responsive grid of `BookCard` components
- Pagination at bottom
- Filters sidebar or top bar:
  - Category (from API)
  - Condition (New / Good / Used)
  - Price range (min/max inputs)
  - Exchangeable (checkbox)
  - Sort by: Newest, Price Low-High, Price High-Low
- API call: `GET /api/books` with query params

### F4.2 — BookCard Component (`components/books/BookCard.jsx`)
- Displays: book image, title, author, price, condition badge, exchangeable badge
- Actions:
  - Click card → navigate to `/books/:id`
  - Wishlist heart icon (toggle add/remove, filled if in wishlist)
  - Add to Cart button
- If user not logged in, wishlist/cart actions redirect to login

### F4.3 — BookFilter Component (`components/books/BookFilter.jsx`)
- Category dropdown (populated from API)
- Condition dropdown
- Price range inputs
- Exchangeable checkbox
- Sort dropdown
- "Apply Filters" / "Clear Filters" buttons
- Updates URL query params → HomePage reads and passes to API

---

## Phase F5: Book Details Page

### F5.1 — Book Details Page (`pages/BookDetailsPage.jsx`)
- Fetch book by ID: `GET /api/books/:id`
- Display:
  - Book image (large)
  - Title, Author, Edition (if present)
  - Price
  - Condition badge
  - Status badge
  - Description (full text)
  - Category name
  - Exchangeable indicator
- Seller info section:
  - Seller name, profile image
  - Contact info (phone, if provided)
- Action buttons (only if user is NOT the book owner and book is Available):
  - "Add to Cart" button
  - "Add to Wishlist" button (heart icon toggle)
  - "Buy Now" button → navigates to `/checkout/:bookId`
  - "Propose Exchange" button (only visible if `exchangeable = true`)
    - Opens a modal/dropdown showing user's own available books
    - User selects one of their books to offer
    - Submit sends `POST /api/exchange-requests`
    - Toast on success/error
- If user is the book owner: show "This is your book" message, no action buttons
- If user not logged in: action buttons redirect to login

---

## Phase F6: Cart & Checkout

### F6.1 — Cart Page (`pages/CartPage.jsx`)
- Fetch: `GET /api/cart`
- Display list of cart items, each showing:
  - Book image (thumbnail)
  - Book title, author
  - Price
  - Condition
  - "Remove" button → `DELETE /api/cart/:id` with confirm
- If book is exchangeable, show exchangeable badge
- Each item has "Buy Now" button → `/checkout/:bookId`
- Empty state: "Your cart is empty" with link to browse books

### F6.2 — Checkout Page (`pages/CheckoutPage.jsx`)
- URL param: `:bookId`
- Fetch book details: `GET /api/books/:id`
- Display: book summary (image, title, price)
- Form:
  - Shipping Address (text area, pre-filled from user profile if available)
  - Payment Method: "Cash on Delivery" (only option, pre-selected, disabled dropdown)
- Two primary action buttons if the book is exchangeable:
  1. "Confirm Order (Buy Now)" → `POST /api/orders` with bookId + shippingAddress
  2. "Propose Exchange" → opens modal showing user's own available books to offer for exchange
- If book is NOT exchangeable: only show "Confirm Order" button
- On order success: toast "Order placed successfully" → redirect to `/dashboard/orders/placed`
- On exchange request success: toast "Exchange request sent" → redirect to `/dashboard/exchange/sent`

---

## Phase F7: Wishlist Page

### F7.1 — Wishlist Page (`pages/WishlistPage.jsx`)
- Fetch: `GET /api/wishlist`
- Display grid of wishlisted books (similar to BookCard but with "Remove from Wishlist" action)
- Each card:
  - Book image, title, author, price, condition
  - "Remove" button → `DELETE /api/wishlist/:id`
  - Click card → navigate to `/books/:id`
- Empty state: "Your wishlist is empty"

---

## Phase F8: User Dashboard

### F8.1 — Dashboard Layout (`pages/DashboardPage.jsx`)
- Left sidebar (`components/dashboard/Sidebar.jsx`) + right content area (`<Outlet />`)
- Sidebar menu items:
  - Profile
  - Books
  - Orders → sub-items: Placed, Received
  - Exchange Requests → sub-items: Sent, Received
- Active menu item highlighted
- Mobile: sidebar collapses to hamburger menu

### F8.2 — Profile Section (`components/dashboard/ProfileSection.jsx`)
- Display: profile image, name, email, phone, address
- "Edit Profile" button → fields become editable (inline editing)
- Editable fields: name, phone, address, profile image (file re-upload)
- Email shown but NOT editable
- "Save Changes" + "Cancel" buttons appear in edit mode
- On save: `PUT /api/users/profile` with FormData
- Toast on success/error

### F8.3 — My Books (`components/dashboard/MyBooks.jsx`)
- Fetch: `GET /api/books/my-books`
- "+ Add New Book" button → navigates to `/dashboard/books/add`
- Table/card list of user's books showing: image thumbnail, title, price, status badge, condition
- Actions per book:
  - "View" → navigate to `/books/:id`
  - "Edit" → navigate to `/dashboard/books/edit/:id` (only if Under_Review/Rejected/Available)
  - "Delete" → confirm modal → `DELETE /api/books/:id`
- Status displayed with color-coded badges:
  - Under_Review: yellow
  - Rejected: red
  - Available: green
  - Reserved: blue
  - Sold: gray
  - Exchanged: purple

### F8.4 — Add Book Form (`components/dashboard/AddBookForm.jsx`)
- Form fields:
  - Title (text, required)
  - Author (text, required)
  - Description (textarea, required)
  - Price (number, required, min 0)
  - Category (dropdown, fetched from `GET /api/categories`, required)
  - Edition (text, optional)
  - Condition (dropdown: New / Good / Used, required)
  - Image (file upload, required, preview shown)
  - Exchangeable (checkbox, default unchecked)
- Frontend validation for all required fields
- On submit: `POST /api/books` with FormData
- On success: toast "Book submitted for review" → redirect to `/dashboard/books`

### F8.5 — Edit Book Form (`components/dashboard/EditBookForm.jsx`)
- Fetch existing book data: `GET /api/books/:id`
- Pre-fill form with existing values
- Same fields as Add form but category is NOT editable
- Show current image, allow re-upload
- On submit: `PUT /api/books/:id` with FormData
- On success: toast "Book updated" → redirect to `/dashboard/books`

### F8.6 — Orders Placed (`components/dashboard/OrdersPlaced.jsx`)
- Fetch: `GET /api/orders/placed`
- Table/card list showing: book image, book title, seller name, price, status, date
- Actions:
  - "Cancel Order" button (only if status = Pending) → confirm modal → `PUT /api/orders/:id/cancel`
  - "Confirm Received" button (only if status = Shipped) → `PUT /api/orders/:id/complete`
  - "View Details" → expandable section or modal showing full order info

### F8.7 — Orders Received (`components/dashboard/OrdersReceived.jsx`)
- Fetch: `GET /api/orders/received`
- Table/card list showing: book image, book title, buyer name, price, status, date
- Actions:
  - "Mark as Shipped" button (only if status = Pending) → `PUT /api/orders/:id/ship`
  - Status = Shipped: show "Waiting for buyer confirmation"
  - Status = Completed: "View Details"
  - Status = Cancelled: no action, show cancelled label

### F8.8 — Exchange Sent (`components/dashboard/ExchangeSent.jsx`)
- Fetch: `GET /api/exchange-requests/sent`
- Card/list showing: requested book info, offered book info, owner name, status, date
- Actions:
  - Status = Pending: "Cancel Request" button → `PUT /api/exchange-requests/:id/cancel`
  - Status = Accepted: "Mark as Exchanged" button → `PUT /api/exchange-requests/:id/complete`
  - Status = Exchanged: "View Details" (irreversible, no further actions)
  - Status = Rejected/Cancelled: no actions

### F8.9 — Exchange Received (`components/dashboard/ExchangeReceived.jsx`)
- Fetch: `GET /api/exchange-requests/received`
- Card/list showing: requested book info, offered book info, requester name, status, date
- Actions:
  - Status = Pending: "Accept" / "Reject" buttons
    - Accept → `PUT /api/exchange-requests/:id/accept`
    - Reject → `PUT /api/exchange-requests/:id/reject`
  - Status = Accepted: "Mark as Exchanged" button → `PUT /api/exchange-requests/:id/complete`
  - Status = Exchanged: "View Details" (irreversible)

---

## Phase F9: Admin Panel

### F9.1 — Admin Dashboard Layout (`pages/AdminDashboardPage.jsx`)
- Left sidebar (`components/admin/AdminSidebar.jsx`) + right content (`<Outlet />`)
- Sidebar menu:
  - Dashboard (stats)
  - Book Review
  - Manage Categories
  - Manage Users
  - All Orders
  - All Exchange Requests

### F9.2 — Admin Dashboard Stats (`components/admin/AdminDashboardStats.jsx`)
- Fetch: `GET /api/admin/dashboard`
- Display stat cards:
  - Total Users
  - Total Books (Available / Under Review / Sold / Exchanged)
  - Total Orders (Pending / Completed / Cancelled)
  - Total Exchange Requests
  - Books Pending Review (highlighted, clickable → goes to review queue)
- Recent orders table (last 10)

### F9.3 — Book Review Queue (`components/admin/BookReviewQueue.jsx`)
- Fetch: `GET /api/books/under-review`
- Table/card list: book image, title, author, price, seller name, submitted date
- Actions per book:
  - "View Details" → expand/modal showing full book info
  - "Approve" → `PUT /api/books/:id/review` with `{ status: 'Available' }` → toast success
  - "Reject" → `PUT /api/books/:id/review` with `{ status: 'Rejected' }` → toast success
- Also a tab/section to view ALL books (all statuses) with filters

### F9.4 — Manage Categories (`components/admin/ManageCategories.jsx`)
- Fetch: `GET /api/categories`
- List/table of categories with name and created date
- "Add Category" button → inline form or modal: name input + submit
  - `POST /api/categories`
- "Edit" action per category → inline edit or modal
  - `PUT /api/categories/:id`
- "Delete" action per category → confirm modal
  - `DELETE /api/categories/:id`
  - Show error toast if category has books

### F9.5 — Manage Users (`components/admin/ManageUsers.jsx`)
- Fetch: `GET /api/admin/users`
- Paginated table: name, email, role, phone, joined date
- Search by name/email
- View user details (expandable row or modal)
- "Delete" action → confirm modal → `DELETE /api/users/:id`
  - Show error toast if user has related data

### F9.6 — Admin All Orders (`components/admin/AdminOrders.jsx`)
- Fetch: `GET /api/admin/orders`
- Paginated table: order ID, book title, buyer, seller, price, status, date
- Filter by status dropdown
- View order details (expand/modal)

### F9.7 — Admin All Exchange Requests (`components/admin/AdminExchangeRequests.jsx`)
- Fetch: `GET /api/admin/exchange-requests`
- Paginated table: request ID, requested book, offered book, requester, owner, status, date
- Filter by status dropdown

---

## Phase F10: Common Components & Polish

### F10.1 — Loader Component
- Centered spinner/skeleton for loading states
- Used across all pages during API calls

### F10.2 — Confirm Modal Component
- Reusable modal: title, message, confirm button, cancel button
- Used for: delete book, cancel order, logout, delete category, etc.

### F10.3 — Pagination Component
- Previous/Next buttons, page numbers
- Accepts: currentPage, totalPages, onPageChange

### F10.4 — Toast Notifications
- Configure react-toastify in App.jsx
- Success (green), Error (red), Info (blue) toasts
- Auto-dismiss after 3 seconds

### F10.5 — Empty States
- "No books found", "Your cart is empty", "No orders yet", etc.
- Each with relevant illustration/icon and CTA button

### F10.6 — Responsive Design
- Mobile-first approach with Tailwind
- Navbar: hamburger menu on mobile
- Sidebar: collapsible on mobile
- Book grid: 1 col mobile, 2 cols tablet, 3-4 cols desktop
- Tables: horizontal scroll on mobile or switch to card layout

### F10.7 — Image Handling
- Book images displayed from `http://localhost:5000/uploads/filename`
- Default placeholder image if image fails to load
- Profile images: circular crop, fallback to initials avatar

---

# Implementation Order (Recommended)

Build backend first, test with Postman, then build frontend.

## Backend Sequence:
1. B1 (Setup) → B2 (Models) → B3 (Middleware)
2. B4 (Auth) → B5 (Users) → B6 (Categories)
3. B7 (Books) → B8 (Orders)
4. B9 (Exchange Requests) → B10 (Wishlist) → B11 (Cart)
5. B12 (Admin APIs)

## Frontend Sequence:
1. F1 (Setup) → F2 (Routing & Layout)
2. F3 (Auth Pages)
3. F4 (Home/Browse) → F5 (Book Details)
4. F6 (Cart & Checkout) → F7 (Wishlist)
5. F8 (User Dashboard — all sub-sections)
6. F9 (Admin Panel)
7. F10 (Polish & Responsive)

---

# Verification & Testing

### Backend Testing
- Use Postman or Thunder Client to test each API endpoint
- Test auth flow: register → login → access protected routes
- Test book flow: create → admin approve → list on home → buy → order status transitions
- Test exchange flow: create request → accept → mark as exchanged
- Test deletion guards: try deleting a book/category/user with active references
- Test edge cases: duplicate wishlist, buying own book, self-exchange, etc.

### Frontend Testing
- Manual walkthrough of all user flows:
  1. Register → Login → Browse → Book Details → Add to Cart → Checkout → Track Order
  2. Post Book → Admin Approve → Book appears on Home
  3. Exchange flow: Propose → Accept → Mark Exchanged
  4. Profile edit, wishlist add/remove, cart add/remove
  5. Admin: review books, manage categories, view users
- Test responsive layout on mobile/tablet viewports
- Test error states: invalid login, 404 pages, network errors
- Test that logged-in user does NOT see own books on home page
- Test that entities with active relationships cannot be deleted
