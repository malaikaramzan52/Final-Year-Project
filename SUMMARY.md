# ReBook — Session Changes Summary

## 1. Checkout Process (End-to-End)

### Backend
- **Order model** (`Backend/model/Order.js`) — Structured `shippingAddress` (fullName, phone, address, city, zip), added Confirmed/Delivered statuses
- **Order controller** (`Backend/controller/order.js`) — POST `/create`, GET `/my-orders`, GET `/seller-orders`, PUT `/:id/status`
- **Auth middleware** — Now checks both cookie and `Authorization: Bearer` header

### Frontend
- **CartContext** — Added `increaseQuantity`, `decreaseQuantity`, `clearCart`
- **CartPage** — Redesigned with qty controls, remove button, order summary sidebar, "Proceed to Checkout"
- **ProductCard / ProductDetails / ProductDetailsCard** — "Buy Now" navigates to `/checkout` with single item via location state; "Add to Cart" shows toast
- **CheckoutPage** — Supports cart flow and buy-now flow; product details display, shipping form pre-filled from profile, COD, confirmation modal on success
- **ProfileContent** — Added "Orders Placed" (buyer, active 3.1) and "Orders Received" (seller, active 3.2) with status update actions
- **ProfilePage** — Accepts `activeTab` from navigation state

### UX Flow
```
Buy Now:  Product → /checkout (single item) → Place Order → Confirmation → View Orders
Cart:     Add to Cart → /cart → /checkout (all items) → Place Order → Confirmation → View Orders
Seller:   Profile → Orders Received → Update Status (Confirm → Ship → Deliver / Cancel)
```

---

## 2. Seed Data

Created `Backend/seed/` with JSON files for all entities and a runner script:

| File | Entity | Count |
|------|--------|-------|
| `categories.json` | Category | 10 (with subTitle + image) |
| `users.json` | User | 5 (4 regular + 1 admin, password: `password123`) |
| `books.json` | Book | 12 (matching static data + extras) |
| `orders.json` | Order | 4 (Pending, Confirmed, Shipped, Delivered) |
| `carts.json` | Cart | 5 |
| `wishlists.json` | Wishlist | 7 |
| `exchangeRequests.json` | ExchangeRequest | 3 |
| `seeder.js` | Script | `node seed/seeder.js` to seed, `--clear` to wipe |

All `_id` fields use consistent ObjectIds for valid cross-entity references.

---

## 3. Frontend → Backend API Integration

Replaced all static `productData` / `categoriesData` imports with live API calls.

### New Backend APIs
- **Book controller** (`Backend/controller/book.js`) — GET `/all`, `/search?q=`, `/category/:id`, `/user/my-books`, `/:id`; POST `/create`; PUT `/:id`; DELETE `/:id`
- **Category controller** (`Backend/controller/category.js`) — GET `/all`
- **Category model** updated with optional `subTitle` and `image` fields
- Routes registered in `app.js`

### New Frontend Utility
- `Frontend/src/utils/normalizeBook.js` — Bridges API shape → component shape:
  - `book.title` → `book.name`
  - `book.image` (string) → `book.image_Url[0].url` (array)
  - `book.user` (populated) → `book.shop` (name, avatar, email)
  - `/uploads/...` paths → full URL with backend origin

### Components Updated

| Component | Before | After |
|-----------|--------|-------|
| Header search | Filtered static `productData` | Debounced `GET /v2/book/search?q=` |
| Header categories | Imported `categoriesData` | Fetches `GET /v2/category/all` |
| BestDeals | Mapped `productData` | Fetches `GET /v2/book/all?sort=latest` |
| BrowseBooks | Sorted `productData` | Fetches `GET /v2/book/all`, client-side sort |
| ProductDetailsPage | `productData.find(id)` | Fetches `GET /v2/book/:id` |
| SuggestedProduct | Filtered by category string | Fetches `GET /v2/book/category/:categoryId` |
| Categories | Imported `categoriesData` | Fetches `GET /v2/category/all` |
| DropDown | Static data prop | API data passed from Header |
| ProductDetails (seller info) | Hardcoded placeholder | Real seller data from populated `book.user` |
| WishlistPage | Used shared Header, static nav | Uses main Header, proper Buy Now / Add to Cart |

---

## 4. Book CRUD in Profile

### Backend
- **PUT `/api/v2/book/:id`** — Update book (owner only), supports image re-upload
- **DELETE `/api/v2/book/:id`** — Delete book (owner only)

### Frontend
- **ProfileContent (active === 2: My Books)** — Full CRUD:
  - List view with status badges, price, condition, category, edit/delete buttons
  - Upload Book — inline form with all fields, category dropdown from API, image upload
  - Edit Book — pre-filled form, saves via PUT
  - Delete — confirm dialog, removes via DELETE
  - Empty state with CTA
- **BecomeSeller** — Now redirects to `/profile` with `activeTab: 2`
- **Header** — "Become Seller" → "Sell Books", links to profile My Books tab

---

## 5. Branding

- **Title**: "React App" → "ReBook"
- **Favicon**: Default React → ReBook branded (orange circle + book icon)
- **manifest.json**: Updated name, short_name, theme_color to `#D98C00`
- **meta description**: "Buy, sell and exchange second-hand books"

---

## API Endpoints (Complete)

```
Books
  GET    /api/v2/book/all?category=&sort=latest|oldest|price_asc|price_desc
  GET    /api/v2/book/search?q=term
  GET    /api/v2/book/category/:categoryId
  GET    /api/v2/book/user/my-books          (auth)
  GET    /api/v2/book/:id
  POST   /api/v2/book/create                 (auth, multipart)
  PUT    /api/v2/book/:id                    (auth, multipart, owner only)
  DELETE /api/v2/book/:id                    (auth, owner only)

Categories
  GET    /api/v2/category/all

Orders
  POST   /api/v2/order/create                (auth)
  GET    /api/v2/order/my-orders             (auth)
  GET    /api/v2/order/seller-orders         (auth)
  PUT    /api/v2/order/:id/status            (auth, seller only)
```
