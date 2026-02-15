# 📱 SmartStore — Production-Grade Cross-Platform E-Commerce

**SmartStore** is a high-performance, scalable mobile shopping application built with **React Native** and the **Expo** ecosystem. This project serves as a **portfolio artifact**, demonstrating sophisticated mobile frontend patterns, centralized state management, and resilient architectural decision-making.

---

## 🏗️ Engineering Goals

Developing for mobile requires a focus on performance, persistence, and deterministic state. This project prioritizes:

* **Type Safety:** Full **TypeScript** implementation to ensure data integrity across API responses and global state.
* **State Persistence:** Integration of **AsyncStorage** to maintain user sessions and cart data across app lifecycles.
* **Modern Routing:** Utilizing **Expo Router** for deep-linkable, file-based routing across Android and iOS.
* **Resilient UI:** Strategic handling of asynchronous data to prevent UI flickering and "null" crashes during API latency.

---

## 🛠️ Architecture & Navigation

### Hybrid Navigation Strategy

The application utilizes a nested navigation architecture to balance ease of use with security:

* **(tabs) Layout:** The primary application context housing the Product Catalog, Shopping Cart, and User Wishlist.
* **Dynamic Stack Routing:** Implements `app/product/[id].tsx` to handle high-volume product rendering through a single, optimized template.
* **Auth Flow:** Dedicated routes for `login.tsx` and `register.tsx` to manage secure user access and onboarding.

---

## 🧠 State Management Design

### Redux Toolkit (RTK) Integration

Global state is managed via a centralized Redux store, ensuring a **Single Source of Truth**:

* **Cart Logic:** Specialized `cartSlice.ts` managing item addition, quantity updates, and state persistence.
* **Wishlist Management:** `wishlistSlice.ts` handling favorites toggling and dynamic UI badge updates.
* **Memoized Selectors:** Optimized logic to calculate totals and counts, preventing unnecessary re-renders in complex UI trees.

---

## 🔐 Forms, Validation & Security

### Schema-Driven Validation

Integrated **React Hook Form** with **Yup** to decouple validation rules from UI components:

* **Strict Security Policy:** Enforces high-entropy passwords via **Regular Expressions (Regex)**:
* Minimum 8 characters.
* Mandatory Uppercase, Lowercase, Number, and Special Character (`@$!%*?&`).


* **Data Integrity:** Implements cross-field validation for "Confirm Password" fields using `yup.ref()`.

---

## 📂 Project Structure

```bash
app/
├── (tabs)/               # Core Tab-based navigation
│   ├── _layout.tsx       # Tab bar configuration
│   ├── cart.tsx          # Cart engine & logic
│   ├── favorites.tsx     # Wishlist management
│   ├── index.tsx         # Product Catalog (Home)
│   └── profile.tsx       # User settings & profile
├── product/              # Nested Dynamic Stack
│   └── [id].tsx          # Dynamic product detail renderer
├── login.tsx             # Authentication entry
└── register.tsx          # Secure signup form
store/                    # Centralized Redux Store
├── cartSlice.ts          # Cart reducers
├── store.ts              # Root store configuration
└── wishlistSlice.ts      # Wishlist logic
components/               # Reusable UI components
constants/                # Theme colors and static data
hooks/                    # Custom React hooks

```

---

## 🚀 Getting Started

1. **Install dependencies**
```bash
npm install

```


2. **Start the app**
```bash
npx expo start

```



In the output, you'll find options to open the app in a **development build**, **Android emulator**, **iOS simulator**, or **Expo Go**. Scan the QR code with your physical device to see the app in action.

---

## 📈 Why This Project Matters

SmartStore represents a shift from "basic app development" to **Mobile Systems Engineering**. It showcases:

1. **Scalable State Persistence:** Managing complex data transitions across app restarts.
2. **Production-Ready Validation:** Protecting user data through rigorous schema enforcement.
3. **Optimized UX:** Supporting Native functionality and providing instant tactile feedback.

---

**Author:** Nodo

**Purpose:** Portfolio Project

**Status:** Final Release — 2026