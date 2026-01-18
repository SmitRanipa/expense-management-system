# Expense Management System

A role-based Expense Management System built with **Next.js App Router**, **NextAuth**, and **Prisma (PostgreSQL)**.

---

## 🚀 Features Implemented

### 🔐 Authentication & Security
- Credentials-based authentication (NextAuth)
- Password hashing with bcrypt
- Role-based access (Admin / Employee)
- Secure session handling
- Role-aware middleware protection

### 🧑‍💼 Admin Capabilities
- Manage employees (People module)
- Categories & Sub Categories
- Projects
- Soft delete & status toggle
- Full data ownership isolation
- Activity logging

### 👨‍🔧 Employee Capabilities
- Secure login under assigned admin
- Role-limited access (expenses & incomes – upcoming)

### 🧱 Architecture Highlights
- App Router structure
- Owner-based data isolation
- Soft delete strategy
- Centralized logging system
- Clean API & UI separation

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React
- **Auth**: NextAuth (Credentials)
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Security**: bcrypt, role-based middleware

---

## 📌 Project Status

✅ Authentication & Authorization  
✅ Admin master modules  
🚧 Expenses module (Next phase)  
🚧 Incomes module  
🚧 Reports & analytics  

---

## 🧑‍💻 Setup (Local)

```bash
npm install
npm run dev
