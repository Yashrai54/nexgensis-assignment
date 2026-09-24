# Setup Steps

### 1. Clone the repository

```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

### 4. Open the application

Visit:

```text
http://localhost:3000
```

# Features

### 1. Centralized API Client

* A shared Axios client is used for all API requests.
* Request interceptor automatically attaches the Bearer access token to authenticated requests.
* Response interceptor provides centralized handling of API errors.

### 2. Authentication

* Log in using the provided DummyJSON credentials.
* Access and refresh tokens are stored after successful authentication.
* Protected product routes redirect unauthenticated users to the login page.

### 3. Product Management

* Product listing with image, title, category, price, rating, and stock.
* Responsive table view for desktop and card view for mobile.
* On clicking the product title, we show product details including image, description, title, reviews, and edit and delete buttons.
* Add new products.
* Form validation for product creation and editing.
* Confirmation before deleting a product.

### 4. Search, Filter & Sort

* Debounced product search.
* Category filtering.
* Sorting by price, rating, and title.
* Search, filter, sort, pagination, and page size are reflected in the URL.
* Since DummyJSON doesnt support Search and filter at the same time, i have priortized filters taking example of most E-commerce UXs where products are split into categories and search is done within those categorized products.
* On entering wrong values in URL, it doesnt break the page and takes to the correct safe page.

### 5. Pagination

* API-based pagination using `limit` and `skip`.
* Page navigation with Previous/Next controls.
* Configurable page sizes: 10, 20, and 50.
* Displays the current page and total pages.

### 6. Product Details

* Dedicated product details page.
* Product images, description, price, and reviews.
* Handles invalid product IDs with a not-found state.

### 7. Error & Loading States

* Loading states for API requests.
* Empty states when no products match the current search/filter.
* Error states with Retry actions.
* Invalid URL parameters fall back to safe default values.

### 8. API Mutation Handling

DummyJSON's mutation endpoints do not persist changes. Successful add, edit, and delete operations are therefore reflected through local application state so that the UI remains consistent during the current session.

### 9. Race Condition Handling

Search requests are debounced and previous requests are cancelled when a newer request becomes relevant, preventing stale API responses from overwriting newer search results.
