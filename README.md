# LIPOS - Modern Retail Operating System

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-cyan)

**LIPOS (Lead Innovationz POS)** is a high-performance, responsive Point of Sale system designed for the modern retail landscape. Built with a unified, design-driven UI/UX, it seamlessly handles inventory, transactions, and customer management across mobile and desktop devices with zero latency.

## 🚀 Features

- **⚡ Lightning Fast Checkout:** Optimized transaction processing with batch database writes and optimistic UI updates.
- **📱 Mobile-First Design:** Fully responsive interface featuring a collapsible sidebar, touch-optimized controls, and a fluid mobile menu.
- **🛒 Smart Cart Management:** Real-time stock validation, VAT calculation, and instant customer association.
- **📦 Dynamic Inventory:** Track stock levels, manage variants, and visualize product categories instantly.
- **👥 Customer CRM:** Integrated customer profiles with detailed purchase history and quick-search functionality.
- **🔐 Secure Authentication:** Robust, production-ready authentication system powered by NextAuth.js v5.
- **📊 Real-time Dashboard:** Live insights into sales performance, revenue metrics, and transaction history.

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router & Server Actions)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/) (Fluid bezier curves)
- **Database:** [PostgreSQL](https://www.postgresql.org/) (via [Neon](https://neon.tech/) Serverless)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** [NextAuth.js v5](https://authjs.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)

## 🏁 Getting Started

### Prerequisites

- Node.js 18+ installed
- A [Neon](https://neon.tech/) database project (or any PostgreSQL instance)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/danirudp/lipos.git
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    # or npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add your credentials:

    ```env
    DATABASE_URL="postgres://user:password@host.neon.tech/neondb?sslmode=require"
    AUTH_SECRET="your-generated-secret-string"
    AUTH_URL="http://localhost:3000" # Use your domain in production
    ```

4.  **Initialize the database:**

    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Run the development server:**

    ```bash
    pnpm dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```

lipos/
├── app/                  \# Next.js App Router
│   ├── (dashboard)/      \# Protected routes (POS, History, Products)
│   ├── api/              \# API Route Handlers (Auth, Orders)
│   ├── login/            \# Public Authentication pages
│   └── page.tsx          \# High-performance Landing Page
├── components/           \# React Components
│   ├── pos/              \# Specialized POS components (Cart, Product Grid)
│   ├── ui/               \# Reusable UI primitives (Buttons, Dialogs)
│   └── ...
├── lib/                  \# Utilities, Actions & Helpers
├── prisma/               \# Database Schema
└── public/               \# Static assets

```

## 🔐 Authentication

The system uses a secure credentials-based login flow.

- **Default Admin Email:** `*****`
- **Default Password:** `*****`

> **Note:** Passwords in the database are hashed using bcrypt. To generate a new hash for a custom password, run the included utility script:
>
> ```bash
> node hash.js
> ```

## 🚀 Deployment

This project is optimized for deployment on **Vercel**.

1.  Push your code to a GitHub repository.
2.  Import the project into Vercel.
3.  Add the `DATABASE_URL`, `AUTH_SECRET`, and `AUTH_URL` environment variables in the Vercel dashboard.
4.  Deploy!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```

```
