# 🌲🏕️ Adventra

### **A Social Networking App for Outdoor Adventurers**

## **Project Overview**

Adventra is a **social networking app** designed to connect outdoor adventurers with like-minded individuals based on adventure type, skill level, and location. Whether it's **hiking, kayaking, rock climbing, or exploring new trails**, users can match and coordinate activities with others who share their passion for the outdoors.

### **Key Features**

- **User Authentication** – Sign up and login (SSO implementation for extra credit).
- **User Profiles** – Create and customize adventure preferences.
- **Matching System** – Swipe left/right to connect with adventurers.
- **In-App Messaging** – Chat, voice, and video calls (extra credit).
- **Profile Photos & Social Media Integration** – Connect Instagram, upload images.
- **Geo-Based Matching** – Find adventurers based on location.

---

## **Tech Stack**

| **Technology**    | **Purpose**                    |
|-------------------|--------------------------------|
| **Next.js**       | Frontend framework             |
| **React**         | UI components                  |
| **Tailwind CSS**  | Styling framework              |
| **PostgreSQL**    | Database                       |
| **Supabase**      | Backend-as-a-service (BaaS)    |
| **Vercel**        | Hosting & deployment           |
| **GitHub Projects** | Agile project management       |
| **GitHub**        | Version control & documentation |

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

- **GitHub Repository**: [Repo Link](https://github.com/masomh-personal/adventra-app)
- **GitHub Projects / Kanban Board**: [Backlog Link](https://github.com/users/masomh-personal/projects/2)

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
jest # run all tests

jest --coverage # run coverage script
```

![CI](https://github.com/masomh-personal/adventra-app/actions/workflows/node.js.yml/badge.svg)
