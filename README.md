# Library Management – Frontend (React + RTK + Tailwind + Ant Design)

This is the **frontend** for the Library Management System. It allows:

- **Users** to browse books and submit borrow requests  
- **Admins** to manage books, categories, and approve/reject requests

---

## How to Run It Locally

### 1. Clone the repo
```bash
git clone https://github.com/minh18ndh/r2e-library-management.git
cd r2e-library-management/library-management-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set backend API endpoint

By default, this app connects to:
```ts
https://c8b2-14-232-74-239.ngrok-free.app/api
```

If you're testing locally, open `src/store/baseQueryWithRefresh.js` and update the `baseUrl`.

---

### 4. Start the app
```bash
npm run dev
```

Then go to:  
`http://localhost:5173` (or whatever your Vite dev server shows)

---

## Auth Notes

- Uses **JWT** for authentication.
- Stores tokens in `localStorage`
- Automatically refreshes expired access tokens using the refresh token.
- You’ll be redirected to `/login` if not authenticated.

---

## Test Accounts

You can register as user via `/register` or login as admin using email: `admin@1` + password: `string`.
