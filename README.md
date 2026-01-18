# 🌲🏕️ Adventra

### **A Social Networking App for Outdoor Adventurers - Proof of Concept**

<div align="left">

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-adventra--app.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://adventra-app.vercel.app/)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/masomh-personal/adventra-app)

</div>

## **Project Overview**

Adventra is a **proof of concept (POC)** social networking app designed to demonstrate a platform for connecting outdoor adventurers. This is a frontend showcase using **mock data stored in localStorage** - no backend-as-a-service (BaaS) is required.

The app demonstrates key UI/UX patterns and component architecture that would power a full production application for matching adventurers based on adventure type, skill level, and location. Whether it's **hiking, kayaking, rock climbing, or exploring new trails**, the app showcases how users could discover and connect with like-minded outdoor enthusiasts.

### **⚠️ Important: This is a Proof of Concept**

- **No Backend Required**: Uses mock data stored in browser localStorage
- **Frontend Showcase**: Demonstrates React/Next.js patterns, component design, and UI/UX
- **Production-Ready Code**: Full TypeScript, testing, CI/CD, and modern development practices
- **Easy to Extend**: Codebase is structured to easily integrate with a real backend later

### **Demonstrated Features**

- **User Authentication UI** – Sign up and login forms with validation
- **User Profiles** – Create and customize adventure preferences
- **Matching System UI** – Swipe left/right interface to browse adventurers
- **Messaging Interface** – Chat UI for matched users (mock conversations)
- **Profile Photos & Social Links** – Image handling and social media integration UI
- **Form Validation** – Comprehensive client-side validation with Yup schemas

---

## **Tech Stack**

| **Technology**      | **Purpose**                               |
| ------------------- | ----------------------------------------- |
| **Next.js 16**      | React framework with SSR and API routes   |
| **React 19**        | UI component library                      |
| **TypeScript**      | Type-safe development                     |
| **Tailwind CSS 4**  | Utility-first styling framework           |
| **React Hook Form** | Form state management                     |
| **Yup**             | Schema validation                         |
| **Vitest**          | Modern testing framework                  |
| **Mock Data**       | localStorage-based mock backend (no BaaS) |
| **Vercel**          | Hosting & deployment                      |
| **GitHub Actions**  | CI/CD pipeline                            |
| **Husky**           | Git hooks for code quality                |

---

## **Development Quality**

This project demonstrates **production-grade development practices**:

- ✅ **TypeScript** with strict type checking
- ✅ **212 unit tests** across 27 test files (Vitest + React Testing Library)
- ✅ **80%+ code coverage** thresholds for statements, branches, functions, and lines
- ✅ **ESLint** with Next.js and TypeScript rules
- ✅ **Prettier** for consistent code formatting
- ✅ **Git hooks** (Husky) for pre-commit and pre-push validation
- ✅ **CI/CD** with GitHub Actions and Vercel automatic deployments

## **Continuous Integration & Deployment**

### GitHub Actions CI Pipeline

![CI](https://github.com/masomh-personal/adventra-app/actions/workflows/node.js.yml/badge.svg)

Automated checks on every push and pull request:

- **Linting** – ESLint validation
- **Type Checking** – TypeScript compilation
- **Testing** – Full test suite execution
- **Build Verification** – Ensures production builds succeed

[View CI Workflow](https://github.com/masomh-personal/adventra-app/actions/workflows/node.js.yml)

### Vercel Deployment

**Automatic deployments** via Vercel:

- ✅ **Production** – Deploys on push to `main` branch
- ✅ **Preview** – Creates preview URLs for pull requests
- ✅ **Build Verification** – Ensures app builds correctly before deployment

<div align="left">

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Vercel_Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://adventra-app.vercel.app/)

</div>

---

## **Team Members & Scrum Roles**

| **Name** | **Role**      |
| -------- | ------------- |
| Baileigh | Scrum Master  |
| Erica    | Product Owner |
| Connor   | Developer     |
| Steve    | Developer     |
| Masom    | Developer     |

---

## **Product Vision**

### **Far Vision**

Adventra aims to become the **go-to platform** for outdoor adventurers looking for **activity partners**, **hiking groups**, and **community events**. Future iterations may include:

- **Real-time adventure planning**
- **AI-driven matching algorithms**
- **Wearable device integration**
- **Community features**
- **Adventure gear marketplace** for rentals and purchases.
- **Global expansion** with multi-language support and localized adventure recommendations.

### **Near Vision (MVP by April)**

A functional web application that includes:

- **User authentication (Sign-up/Login)**
- **Profile creation & photo uploads**
- **Adventure-based matching (swipe left/right)**
- **Basic messaging system for matched users**

📄 **Full details can be found in** [`docs/product-vision.md`](_docs/product-vision.md).

---

## **Product Backlog**

The backlog is managed in **GitHub Projects**. View the full backlog here:  
➡️ **[Backlog Link](https://github.com/users/masomh-personal/projects/2)**

🔹 **Backlog Prioritization Rationale** is documented in **[`docs/backlog-prioritization.md`](_docs/backlog-prioritization.md)**.

---

## **Definition of Ready**

Each Product Backlog Item (PBI) must include:

- **Title**
- **User Story** (Follows the format: "As a user, I want to…")
- **Additional Details** (API integration, UI requirements, dependencies, etc.)
- **Story Point Estimation**
- **Acceptance Criteria**

---

## **Useful Links**

<div align="left">

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-adventra--app.vercel.app-00C7B7?style=flat-square&logo=vercel&logoColor=white)](https://adventra-app.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/masomh-personal/adventra-app)
[![GitHub Projects](https://img.shields.io/badge/GitHub-Projects_Board-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/users/masomh-personal/projects/2)

</div>

---

## Getting Started Locally

Follow these steps to run the Adventra app locally on your machine.

---

### 1. Clone the Repository

```bash
git clone https://github.com/masomh-personal/adventra-app

cd adventra-app

git checkout main # if needed
```

### 2. Install Dependencies

```bash
npm install # within the root directory
```

### 3. Run Development Server locally

```bash
npm run dev # can access site via localhost:3000
```

### 4. Run Tests and Check Test Coverage

```bash
# Run all tests
npm run test:run

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### 5. Development Quality Checks

```bash
# Run linting, type-checking, and format checking
npm run healthcheck

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type check only
npm run type-check
```

---

## **Architecture Overview**

### Mock Backend

The app uses a **mock Appwrite client** that simulates backend behavior:

- **Data Storage**: Mock user profiles, matches, and messages stored in `localStorage`
- **Authentication**: Client-side session management (no real backend required)
- **API Simulation**: Mock API responses that mirror real Appwrite SDK patterns
- **Easy Migration**: Code is structured to easily swap mock client for real Appwrite SDK

### Code Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Next.js pages and API routes
├── lib/            # Utilities, mock clients, helpers
├── services/       # Business logic layer
├── hooks/          # Custom React hooks
├── contexts/       # React context providers
├── validation/     # Yup validation schemas
└── types/          # TypeScript type definitions
```

### Testing Strategy

- **Unit Tests**: Component behavior, utility functions, services
- **Integration Tests**: Form workflows, user interactions
- **Mock Strategy**: Comprehensive mocking of Appwrite SDK for reliable tests
- **Coverage Goals**: 80%+ coverage across all metrics
