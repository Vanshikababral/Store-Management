<p align="center">
  <h1 align="center">🏪 Matrix Store Management System</h1>
  <p align="center">
    A full-stack retail management platform with an intelligent POS terminal, real-time inventory tracking, executive dashboard, and role-based access control.
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Django-6.0-092E20?style=for-the-badge&logo=django&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [API Endpoints](#-api-endpoints)
- [Architecture](#-architecture)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔍 Overview

**Matrix Store Management** is a complete retail management solution designed for store managers and staff. It provides a modern, Matrix-themed UI with real-time inventory management, a smart Point-of-Sale system with tax-inclusive receipt printing, an executive dashboard with analytics, and automated email alerts for low stock and user approvals.

---

## ✨ Features

### 🖥️ Executive Dashboard

- Real-time revenue, sales count, and inventory health metrics
- Interactive sales charts powered by Recharts
- Low-stock supply alerts
- Category-wise inventory breakdown
- Quick sale modal for fast transactions

### 🛒 Smart POS Terminal

- Visual product selection with stock-aware logic
- Multi-item cart with real-time total calculations
- GST tax computation (CGST + SGST breakdown)
- Auto-generated thermal-style receipt with print support
- Prevents overselling with live stock validation

### 📦 Inventory Management

- Full CRUD for products (create, view, edit, delete)
- Product images with Cloudinary cloud hosting
- SKU-based tracking with category filters
- Inline stock adjustment
- Excel export support via SheetJS

### 🏷️ Department Management

- Create, rename, and delete product categories
- Category-linked product organization

### 👥 User & Access Control

- JWT-based authentication (login/signup)
- Role-based access: **Admin** vs **Staff**
- Admin approval workflow for new registrations
- User management panel (approve, promote, delete users)
- User profile page

### 📧 Automated Email Notifications (Django Signals)

- **Low Stock Alert** — Emails admin when any product drops to ≤ 10 units after a sale
- **Account Approval** — Emails the user when their account is activated by an admin

### 📊 Transaction History

- Full sales ledger with timestamps
- Searchable and sortable records

---

## 🛠️ Tech Stack

### Backend

| Technology                | Purpose                          |
| ------------------------- | -------------------------------- |
| **Django 6.0**            | Web framework & ORM              |
| **Django REST Framework** | RESTful API layer                |
| **SimpleJWT**             | Token-based authentication       |
| **SQLite**                | Development database             |
| **Cloudinary**            | Cloud image storage              |
| **Django Signals**        | Event-driven email notifications |

### Frontend

| Technology         | Purpose                        |
| ------------------ | ------------------------------ |
| **React 19**       | UI component library           |
| **Vite 7**         | Build tool & dev server        |
| **Tailwind CSS 4** | Utility-first styling          |
| **React Router 7** | Client-side routing            |
| **Axios**          | HTTP client with interceptors  |
| **Recharts**       | Dashboard chart visualizations |
| **Lucide React**   | Modern icon library            |
| **SheetJS (xlsx)** | Excel export functionality     |

---

## 📁 Project Structure

```
Store-Management/
├── core_backend/           # Django project config
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── inventory/              # Main Django app
│   ├── models.py           # Product, Category, Sale models
│   ├── views.py            # API views (ListCreate, RetrieveUpdateDestroy)
│   ├── serializers.py      # DRF serializers + custom JWT serializer
│   ├── signals.py          # Low-stock & approval email signals
│   ├── admin.py            # Django admin registration
│   └── urls.py             # API URL routing
├── frontend/               # React application
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx       # Executive dashboard with analytics
│   │   │   ├── Inventory.jsx       # Product management table
│   │   │   ├── POS.jsx             # Point-of-Sale page
│   │   │   ├── Transactions.jsx    # Sales history ledger
│   │   │   ├── Departments.jsx     # Category CRUD
│   │   │   ├── UserManagement.jsx  # Admin user control panel
│   │   │   ├── Profile.jsx         # Current user profile
│   │   │   ├── Auth.jsx            # Login & Signup
│   │   │   ├── ApprovalPending.jsx # Waiting-for-approval screen
│   │   │   └── ProductDetail.jsx   # Single product view
│   │   ├── components/
│   │   │   ├── QuickPOS.jsx        # POS terminal component
│   │   │   ├── QuickSaleModal.jsx  # Dashboard quick sale modal
│   │   │   ├── Sidebar.jsx         # Navigation sidebar
│   │   │   ├── StatsGrid.jsx       # Dashboard stat cards
│   │   │   ├── SalesChart.jsx      # Revenue chart
│   │   │   ├── InventoryList.jsx   # Product list component
│   │   │   ├── AddProductForm.jsx  # New product form
│   │   │   ├── FilterToolbar.jsx   # Search & filter bar
│   │   │   ├── CategoryBreakdown.jsx
│   │   │   ├── SupplyAlerts.jsx
│   │   │   └── Pagination.jsx
│   │   ├── utils/
│   │   │   └── axiosInstance.js     # Axios with JWT interceptors & auto-refresh
│   │   ├── services/
│   │   │   └── api.js              # API service helpers
│   │   └── App.jsx                 # Root component with routing
│   └── package.json
├── manage.py
├── .gitignore
└── README.md
```

---

## 🚀 Installation

### Prerequisites

- **Python 3.10+**
- **Node.js 18+**
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/Vanshikababral/Store-Management.git
cd Store-Management
```

### 2. Backend Setup (Django)

```bash
# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers Pillow django-cloudinary-storage cloudinary

# Run migrations
python manage.py migrate

# Create admin account
python manage.py createsuperuser

# Start the backend server
python manage.py runserver
```

The API will be running at `http://127.0.0.1:8000/api/`

### 3. Frontend Setup (React)

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be running at `http://localhost:5173`

### 4. Environment Configuration

Update the following in `settings.py` before deploying:

| Setting               | Location              | Description                     |
| --------------------- | --------------------- | ------------------------------- |
| `SECRET_KEY`          | `settings.py:25`      | Replace with a secure key       |
| `CLOUDINARY_STORAGE`  | `settings.py:145-149` | Your Cloudinary credentials     |
| `EMAIL_HOST_USER`     | `settings.py:162`     | Gmail address for notifications |
| `EMAIL_HOST_PASSWORD` | `settings.py:163`     | Google App Password             |

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint                       | Description                     |
| ------ | ------------------------------ | ------------------------------- |
| `POST` | `/api/token/`                  | Login (returns JWT tokens)      |
| `POST` | `/api/token/refresh/`          | Refresh access token            |
| `POST` | `/api/register/`               | User registration               |
| `GET`  | `/api/me/`                     | Current user profile            |
| `GET`  | `/api/user-status/<username>/` | Check account activation status |

### Products

| Method      | Endpoint              | Description              |
| ----------- | --------------------- | ------------------------ |
| `GET`       | `/api/products/`      | List all products        |
| `POST`      | `/api/products/`      | Create a product (Admin) |
| `GET`       | `/api/products/<id>/` | Product details          |
| `PUT/PATCH` | `/api/products/<id>/` | Update product (Admin)   |
| `DELETE`    | `/api/products/<id>/` | Delete product (Admin)   |

### Categories

| Method   | Endpoint                | Description             |
| -------- | ----------------------- | ----------------------- |
| `GET`    | `/api/categories/`      | List all categories     |
| `POST`   | `/api/categories/`      | Create category (Admin) |
| `PUT`    | `/api/categories/<id>/` | Update category (Admin) |
| `DELETE` | `/api/categories/<id>/` | Delete category (Admin) |

### Sales

| Method | Endpoint      | Description       |
| ------ | ------------- | ----------------- |
| `GET`  | `/api/sales/` | List all sales    |
| `POST` | `/api/sales/` | Record a new sale |

### User Management (Admin Only)

| Method   | Endpoint           | Description          |
| -------- | ------------------ | -------------------- |
| `GET`    | `/api/users/`      | List all users       |
| `PATCH`  | `/api/users/<id>/` | Approve/promote user |
| `DELETE` | `/api/users/<id>/` | Delete user          |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   React Frontend                     │
│          (Vite + TailwindCSS + React Router)         │
│                                                      │
│  Auth ─── Dashboard ─── Inventory ─── POS ─── Users  │
└──────────────────────┬──────────────────────────────┘
                       │ Axios + JWT Interceptors
                       ▼
┌─────────────────────────────────────────────────────┐
│               Django REST Framework                  │
│                                                      │
│  TokenObtainPairView ── ProductViewSet ── SaleList   │
│  RegisterView ── UserListView ── CategoryList        │
│                                                      │
│  ┌─────────────┐  ┌──────────────────────────────┐  │
│  │ SimpleJWT   │  │ Django Signals               │  │
│  │ Auth Layer  │  │ • Low Stock Email Alert       │  │
│  │             │  │ • User Approval Notification  │  │
│  └─────────────┘  └──────────────────────────────┘  │
└──────────────────────┬──────────────────────────────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
     ┌─────────┐ ┌──────────┐ ┌──────────┐
     │ SQLite  │ │Cloudinary│ │  Gmail   │
     │   DB    │ │  Images  │ │  SMTP    │
     └─────────┘ └──────────┘ └──────────┘
```

---

## 📸 Screenshots

> _Add screenshots of your application here to showcase the UI._
>
> Recommended screenshots:
>
> - Login Page
> - Executive Dashboard
> - Inventory Management
> - POS Terminal
> - Receipt Print Preview
> - User Management Panel

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/Vanshikababral">Vanshika Babral</a>
</p>
