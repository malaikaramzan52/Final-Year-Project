- [x] Phase B1: Project Setup & Configuration — Updated .env (PORT 5000, Mongo URI with db name, JWT secrets, CLIENT_URL); CORS now uses CLIENT_URL env; nodemon dev script present.
- [x] Phase B2: Models — Added Category, Book, Order, ExchangeRequest, Wishlist, Cart schemas per plan (status enums, compound uniqueness for wishlist/cart, book status workflow).
 - [ ] Phase B3: Middleware — Have cookie-based auth and error handlers; switch to Bearer-token protect/authorize and shared Multer uploadSingle('image').
 - [ ] Phase B4: Auth Routes & Controllers — Current /api/v2/user covers signup/login/avatar; rebuild /api/auth register/login/forgot/reset/me with token-in-header instead of cookies.
 - [ ] Phase B5: User Routes & Controllers — Extend beyond profile edit to add profile fetch, admin list/delete users, and owner safety checks.
 - [ ] Phase B6: Category Routes & Controllers — New admin CRUD endpoints; ensure unique names and delete guard when books reference categories.
 - [ ] Phase B7: Book Routes & Controllers — Fresh module for book CRUD with status workflow, ownership checks, image upload, and review transitions.
 - [ ] Phase B8: Order Routes & Controllers — Implement buyer/seller order flow, status transitions (Pending→Shipped→Completed/Cancelled), and book status sync.
 - [ ] Phase B9: Exchange Request Routes & Controllers — Add exchange request lifecycle with duplicate prevention and book status coordination.
 - [ ] Phase B10: Wishlist Routes & Controllers — Build wishlist CRUD with compound uniqueness and login guard.
 - [ ] Phase B11: Cart Routes & Controllers — Build cart CRUD with compound uniqueness and login guard; remove items on book status change.
 - [ ] Phase B12: Admin Panel APIs — Add dashboard stats and admin listings for users/orders/exchange requests/books.


 
- [x] Phase F1: Frontend Setup & Configuration — Kept CRA/Tailwind v3; set API base to backend port 5000 via env-aware server constant and added axios instance with JWT interceptor/401 redirect.
- [x] Phase F2: Routing & Layout — Added AppRoutes with ProtectedRoute/AdminRoute guards and centralized routing; App now renders via AppRoutes.
 - [x] Phase F3: Auth Pages — Login/Signup now use /auth endpoints with JWT stored locally; added Forgot/Reset flows and wired to /auth/forgot-password and /auth/reset-password; activation uses /auth/activation.
 - [ ] Phase F4: Home Page & Book Browsing — Wire Home/Browse components to /api/books with filters/pagination and category bar.
 - [ ] Phase F5: Book Details Page — Refactor details view to new book schema, seller info, and conditional actions (owner vs buyer).
 - [ ] Phase F6: Cart & Checkout — Replace local CartContext with API-driven cart and order creation + shipping address capture.
 - [ ] Phase F7: Wishlist Page — Wire wishlist UI to /api/wishlist with add/remove and empty states.
 - [ ] Phase F8: User Dashboard — Implement sidebar layout plus Profile/MyBooks/Orders/Exchange sections backed by new APIs.
 - [ ] Phase F9: Admin Panel — Add admin dashboard, book review queue, categories/users/orders/exchange management UIs.
 - [ ] Phase F10: Common Components & Polish — Add Loader, ConfirmModal, Pagination, and toast setup; standardize styling.
