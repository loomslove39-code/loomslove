# LoomsLove — Firebase Setup & Admin Guide

## 🏗️ Architecture

LoomsLove is a **static site** hosted on GitHub Pages with **Firebase** as the backend:

- **Frontend**: Pure HTML/CSS/JS (no framework, no build step)
- **Database**: Cloud Firestore (NoSQL)
- **Authentication**: Firebase Auth (Email/Password)
- **Image Hosting**: ImgBB (free image upload API)
- **Hosting**: GitHub Pages (static files served via CDN)

---

## 📋 Prerequisites

- A [Google Account](https://accounts.google.com)
- A [GitHub Account](https://github.com) (for hosting)
- Basic familiarity with the Firebase Console

---

## 🔥 Firebase Setup (Step-by-Step)

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Create a project"**
3. Enter project name: `loomslove` (or your choice)
4. Disable Google Analytics if not needed → **Create Project**

### 2. Register a Web App

1. In your project dashboard, click the **Web icon** (`</>`)
2. App nickname: `LoomsLove Web`
3. ☑ Check **"Also set up Firebase Hosting"** (optional)
4. Click **Register app**
5. Copy the `firebaseConfig` object — you'll need this!

### 3. Enable Authentication

1. Go to **Build → Authentication → Sign-in method**
2. Click **Email/Password** → Enable it → Save
3. Go to the **Users** tab → **Add user** to create your first admin:
   - Email: `admin@loomslove.com`
   - Password: `YourSecurePassword123!`

### 4. Set Up Cloud Firestore

1. Go to **Build → Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (we'll secure it later)
4. Select your preferred region (e.g., `asia-south1` for India)

### 5. Configure Firestore Security Rules

Go to **Firestore → Rules** and paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Products: anyone can read, only authenticated users can write
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Orders: only authenticated users can read and write
    match /orders/{orderId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Click **Publish**.

### 6. Update Firebase Config in Code

Open `js/firebase-config.js` and replace the config with yours:

```js
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

Also update the same config in `js/main.js` (for the storefront).

---

## 🖼️ ImgBB Setup (Image Hosting)

1. Go to [api.imgbb.com](https://api.imgbb.com)
2. Create a free account
3. Get your **API key** from the dashboard
4. Update `js/firebase-config.js`:

```js
export const IMGBB_API_KEY = "your_api_key_here";
```

---

## 🛠️ Admin Portal Usage

### Accessing the Admin

Navigate to: `https://www.loomslove.com/admin.html`

### Sign In

1. Use the **Sign In** tab with your registered email/password
2. First-time? Use the **Register** tab to create an admin account

### Managing Products

| Action | How |
|--------|-----|
| **Add Product** | Products tab → "+ Add Product" → Fill form → Select image → Submit |
| **Edit Product** | Click ✏️ Edit on any product row → Modify details → Save |
| **Delete Product** | Click 🗑️ on any product row → Confirm |
| **Update Stock** | Use the **−/+** buttons directly in the Stock column |
| **Search** | Type in the search bar to filter by name or category |

### Tracking Orders

When a customer orders via WhatsApp:

1. Go to **Orders** tab → **"+ Log Order"**
2. Enter customer name, phone, items ordered, and total amount
3. Set status to **Pending**
4. As the order progresses, change status directly from the dropdown:
   - `Pending` → `Confirmed` → `Shipped` → `Delivered`
   - Or `Cancelled` if needed

### Dashboard

The Dashboard shows real-time stats:
- **Total Products** — number of products in your store
- **Total Orders** — number of logged orders
- **Revenue** — sum of all non-cancelled order totals
- **Low Stock** — products with stock ≤ 5

---

## 📁 Project File Structure

```
loomslove/
├── index.html              → Customer-facing storefront
├── admin.html              → Admin dashboard (login + management)
├── CNAME                   → Custom domain config
├── css/
│   ├── styles.css          → Storefront styles
│   └── admin.css           → Admin dashboard styles
├── js/
│   ├── firebase-config.js  → Shared Firebase config
│   ├── main.js             → Storefront logic (cart, wishlist, WhatsApp)
│   ├── admin.js            → Admin auth, navigation, dashboard
│   ├── admin-products.js   → Product CRUD + image upload
│   └── admin-orders.js     → Order tracking
├── images/                 → Category banners & product images
├── FIREBASE-SETUP.md       → This file
└── README.md               → Project overview
```

---

## Firestore Data Structure

### `products` collection

```json
{
  "name": "Silk Evening Dress",
  "image": "https://i.ibb.co/xxx/image.jpg",
  "category": "luxury-love",
  "price": 2999,
  "originalPrice": 3999,
  "stock": 25,
  "createdAt": "Timestamp"
}
```

**Categories:** `budget-love`, `classic-love`, `festive-love`, `luxury-love`

### `orders` collection

```json
{
  "customerName": "Priya Sharma",
  "phone": "+91 98765 43210",
  "items": "1x Silk Evening Dress (L), 2x Linen Top (M)",
  "total": 4897,
  "status": "confirmed",
  "notes": "Gift wrapping requested",
  "createdAt": "Timestamp"
}
```

**Statuses:** `pending`, `confirmed`, `shipped`, `delivered`, `cancelled`

---

## 🌐 Hosting Options (All Free)

| Platform | Best For | Custom Domain | Auto-Deploy |
|----------|----------|---------------|-------------|
| **GitHub Pages** ✅ (current) | Simple static sites | ✅ Yes | ✅ On push |
| **Netlify** | Static + forms | ✅ Yes | ✅ On push |
| **Vercel** | Static + serverless | ✅ Yes | ✅ On push |
| **Cloudflare Pages** | Global CDN perf | ✅ Yes | ✅ On push |
| **Firebase Hosting** | Full Firebase integration | ✅ Yes | Manual CLI |

### Recommendation

**GitHub Pages is perfect for LoomsLove.** Since the entire backend is Firebase (auth + database), you only need static file hosting. GitHub Pages gives you:
- Free HTTPS
- Custom domain support (already configured: `www.loomslove.com`)
- Auto-deploy on `git push`
- Zero cost

No need to switch unless you need server-side rendering or serverless functions.

---

## ⚠️ Security Notes

1. **Firebase API keys** in client-side JS are normal — security comes from **Firestore Rules**
2. **ImgBB API key** is public — anyone could use your upload quota. For production, consider Firebase Storage instead
3. **Registration** is open — any visitor to `/admin.html` can create an account. To restrict:
   - Remove the Register tab after creating your admin accounts
   - Or add a Firestore `admins` collection and check membership in security rules

---

## 🚀 Quick Deploy Checklist

1. ✅ Firebase project created
2. ✅ Email/Password auth enabled
3. ✅ Firestore database created
4. ✅ Security rules published
5. ✅ Firebase config updated in `js/firebase-config.js`
6. ✅ Firebase config updated in `js/main.js`
7. ✅ ImgBB API key configured
8. ✅ Admin user created in Firebase Auth
9. ✅ `git push` to deploy to GitHub Pages
