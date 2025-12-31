# SubVantage | Intelligent Subscription Manager

![CI/CD Pipeline](https://github.com/iyawnnn/SubVantage/actions/workflows/playwright.yml/badge.svg)

SubVantage is a specialized financial dashboard designed to centralize the management of recurring digital expenses. The primary objective of the platform is to provide users with a granular view of their financial footprint, eliminating "vampire costs" through automated tracking, renewal forecasting, and spending analytics. It is built to transform chaotic bank statement data into a streamlined, visual command center.


## Technical Solution

The application addresses the synchronization gap between scattered billing cycles and actual monthly spending. By leveraging server-side calculations and real-time currency normalization, SubVantage provides a unified financial truth regardless of the billing source or original currency.

### Key Functional Areas

* **Financial Command Center:** A high-level dashboard visualizing "Monthly Burn" and "Annual Projections." It utilizes spending velocity charts to map out financial trajectories over 6-month windows.
* **Subscription Lifecycle Management:** A robust CRUD system for active, paused, and cancelled subscriptions. It includes a "Graveyard" archive system to track historical savings from cancelled services.
* **Intelligence & Alerts:** An automated engine that monitors trial expirations and renewal dates. It integrates with **Resend** to dispatch email notifications prior to billing cycles, preventing unwanted charges.
* **Multi-Currency Normalization:** A real-time exchange rate engine that converts international subscriptions (USD, EUR, GBP, JPY, PHP) into the user's preferred base currency for accurate total calculations.
* **Smart Onboarding:** A personalized, animated entry flow that configures user preferences (currency, theme, notifications) upon first login.


## Tech Stack

The platform is architected using the modern **T3-adjacent Stack**, prioritizing type safety and server-side performance.

### Frontend
* **Next.js 15 (App Router):** Utilizes React Server Components (RSC) for optimized initial loads and SEO, with client boundaries only where interactivity is required.
* **Tailwind CSS & Shadcn/ui:** Implementation of a "Dark Glass" aesthetic using utility-first CSS, backdrop blurs, and sophisticated gradients.
* **Framer Motion:** Powers the fluid page transitions, modal entrances, and the onboarding carousel.
* **Recharts:** Renders responsive data visualizations for categorical spending and velocity tracking.

### Backend
* **Server Actions:** Eliminates the need for a separate API layer by executing database mutations directly from the client components.
* **Prisma ORM:** Provides a type-safe interface for database interactions, schema migrations, and relational data management.
* **NextAuth.js (v5):** Handles secure authentication sessions, middleware protection, and OAuth providers.

### Database
* **PostgreSQL:** A relational database used for structured storage of user profiles, subscription nodes, and billing cycles.


## Deployment & Infrastructure

The system is designed for serverless scalability:

* **Hosting:** Deployed on **Vercel**, leveraging Edge Networks for global content delivery and serverless function execution.
* **Edge Generation:** Dynamic asset generation (Favicons, Open Graph images) is handled at the edge using `next/og`, reducing bundle size and ensuring brand consistency.
* **Email Infrastructure:** Transactional emails are routed through **Resend**, ensuring high deliverability for critical billing alerts.


## Operational Features

* **Adaptive Glassmorphism:** The UI features a sophisticated dark mode with ambient background lighting that reacts to screen size, providing a premium depth of field.
* **Live Currency Conversion:** The system fetches and caches live exchange rates, allowing users to add a subscription in JPY and see the impact in USD instantly.
* **Privacy-First Architecture:** Subscription data is scoped strictly to the authenticated user via multi-tenant database logic, ensuring no data bleed between accounts.
* **Dynamic 404 Handling:** A custom error routing system that captures invalid paths and presents a branded recovery interface, overlaying standard layout elements.