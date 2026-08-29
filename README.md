# Bugzilla 2.0 🐛

> **Modern Issue Tracking & Automated Git Workflow Platform**  
> Built with Next.js 16, TypeScript, Prisma, Tailwind CSS v4, and PostgreSQL.

---

## 🚀 Live Demo

* **Production Application:** [https://bugzilla-next.vercel.app/](https://bugzilla-next.vercel.app/)
* **Database Engine:** Supabase PostgreSQL (Connection Pooling)
* **Deployment Platform:** Vercel

---

## ✨ Features

* **Interactive Issue Management:**
  * Modern Kanban Board with drag-and-drop state transitions across `NEW / REPORTED`, `ASSIGNED`, `IN PROGRESS`, `RESOLVED`, and `VERIFIED / CLOSED`.
  * Comprehensive Data Grid / Table views for high-density issue triage.
  * Rapid issue creation with global search modal (`⌘K`).

* **Automated Git Integration (Webhooks):**
  * Auto-resolves tracked bugs when commit messages contain keyword pattern triggers (e.g., `Fixes CORE-101`, `Closes CORE-102`).
  * Automatically appends bot comments containing commit SHA, author info, and timestamps.
  * Maintains an automated audit log trail of status changes and system events.

* **Developer Experience & Architecture:**
  * Full dark-theme design system engineered using **Tailwind CSS v4**.
  * Strongly typed database operations powered by **Prisma ORM**.
  * Fast client/server builds using Next.js Turbopack compiler.

---

## 🛠️ Tech Stack

* **Framework:** Next.js 16.3.3 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS v4 (`@tailwindcss/postcss`)
* **Database & ORM:** PostgreSQL (Supabase), Prisma ORM
* **Icons & UI Utilities:** Lucide React, `clsx`, `tailwind-merge`, `@hello-pangea/dnd`
* **Runtime Execution:** Node.js / `npx tsx`

---

## 🚦 Getting Started Locally

### Prerequisites

* Node.js (v20+ recommended)
* npm / pnpm
* PostgreSQL instance (Local or Cloud provider)

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/](htt
   ps://github.com/)<your-username>/bugzilla-next.git
   cd bugzilla-next
2. **Install dependencies**:
   npm install
3. **Create a .env file in the root directory:**
   DATABASE_URL="postgresql://postgres:password@localhost:5432/bugzilla"
4. **Initialize Database Schema & Seed Data:**
   npx prisma db push
   npx prisma db seed
5. **Start the Development Server:**
   npm run dev

## 🔗 GitHub Webhook Integration Setup

To link automatic commit resolution to your repository:

1. Open your repository on **GitHub** → **Settings** → **Webhooks**.
2. Click **Add webhook**.
3. Configure the parameters:
   * **Payload URL:** `https://bugzilla-next.vercel.app/api/webhooks/git`
   * **Content type:** `application/json`
   * **Event trigger:** `Just the push event`
4. Click **Add webhook**.
5. Test by pushing a commit with `Fixes <ISSUE_KEY>` in the commit message.

## 📜 Scripts Reference

| Command | Description |
| :--- | :--- |
| `npm run dev` | Launches the Next.js development server |
| `npm run build` | Generates Prisma Client and builds the production app |
| `npm run start` | Runs the compiled production build |
| `npm run lint` | Runs Next.js ESLint checks |

📄 License:
---

### Terminal Command to Commit & Push

```powershell
git add README.md
git commit -m "docs: add complete production README for project submission"
git push origin main

   
