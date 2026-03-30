# 🌿 EcoSpark Hub Community Sustainability Portal

**EcoSpark Hub** is a full-stack online community portal where members can share, discover, and vote on sustainability-driven ideas from reducing plastic waste to launching local solar projects. Built with modern web technologies to deliver a clean, responsive, and engaging user experience.

---

## 🌐 [Live Demo](https://be-a-industry-standard-fusionist-fr.vercel.app/) |

## ✨ Features

### Authentication

- Email & password-based registration and login
- JWT-based secure session management
- Password hashing for security
- Form validation with real-time feedback and loading states

### 💡 Idea Management

- Members can create ideas with title, problem statement, proposed solution, description, and images
- **Draft Mode** — save ideas without publishing
- **Submit for Review** — move idea from Draft → Under Review
- Admin can **Approve** or **Reject** ideas with feedback
- Members can edit or delete ideas only while unpublished

### 💳 Paid Ideas

- Members can mark ideas as **Paid**
- Other members must complete payment to unlock paid idea content
- Unauthenticated users are redirected to login/register before purchasing
- Free ideas are publicly accessible to everyone

### 🗳️ Voting System

- Members can **upvote** or **downvote** any approved idea
- One vote per member per idea
- Members can **remove** their vote at any time

### 💬 Comment System

- Nested comment threads
- Members can reply to any comment
- Admins can delete inappropriate comments

### 🔍 Search & Filter

- Search ideas by keyword, title, or description
- Filter by category, payment status, vote range, or author
- Sort by: **Most Recent**, **Top Voted**, **Most Commented**
- Paginated results (10–12 ideas per page)

### 🛡️ Admin Dashboard

- View and manage all member accounts
- Activate/deactivate member accounts
- Approve or reject submitted ideas with feedback
- View ideas by status: **Under Review**, **Approved**, **Rejected**

### 📊 Member Dashboard

- View all personal ideas with their current status
- Create, edit, draft, and submit ideas
- Track admin feedback on rejected submissions

---

### Payments

| Technology | Purpose                            |
| ---------- | ---------------------------------- |
| **Stripe** | Payment integration for paid ideas |

## Project Structure

```
ecospark-hub-client/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── ideas/
│   │   ├── page.tsx          # All Ideas (paginated)
│   │   └── [id]/
│   │       └── page.tsx      # Idea Details
│   ├── dashboard/
│   │   ├── admin/            # Admin Dashboard
│   │   └── member/           # Member Dashboard
│   ├── about/
│   ├── blog/
│   └── page.tsx              # Home Page
├── components/
│   ├── ui/                   # Reusable UI components
│   ├── IdeaCard.tsx
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── VotingButtons.tsx
├── lib/
│   ├── api.ts                # API utility functions
│   └── auth.ts               # Auth helpers
├── public/
├── .env.local
└── next.config.js
```

---

## 📄 Pages Overview

| Page             | Route               | Access               |
| ---------------- | ------------------- | -------------------- |
| Home             | `/`                 | Public               |
| All Ideas        | `/all-ideas`        | Public               |
| Idea Details     | `/all-ideas/[id]`   | Public (Free) / Paid |
| Login            | `/login`            | Public               |
| Register         | `/register`         | Public               |
| Member Dashboard | `/dashboard/member` | Members only         |
| Admin Dashboard  | `/dashboard/admin`  | Admin only           |
| About Us         | `/about`            | Public               |
| Blog             | `/blog`             | Public               |
| My Profile       | `/profile`          | Members only         |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** v18+
- **pnpm** or **yarn**
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/mdimranhossainwd/be-a-industry-standard-fusionist-frontend-assignment
cd be-a-industry-standard-fusionist-frontend-assignment
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory and add the required variables (see [Environment Variables](#-environment-variables) section below).

### 4. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---
