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
| **Technology**            | **Purpose**                      |
|---------------------------|---------------------------------|
| **Next.js**               | Frontend framework              |
| **React**                 | UI components                   |
| **Tailwind CSS**          | Styling framework               |
| **PostgreSQL**            | Database                        |
| **Prisma**                | ORM for database management     |
| **Vercel**                | Hosting & deployment            |
| **GitHub Projects**       | Agile project management        |
| **GitHub**                | Version control & documentation |

---

## **Team Members & Scrum Roles**
| **Name**   | **Role**        |
|-----------|----------------|
| Baileigh  | Scrum Master    |
| Erica     | Product Owner   |
| Connor    | Developer       |
| Steve     | Developer       |
| Masom     | Developer       |

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

📄 **Full details can be found in** [`docs/product-vision.md`](docs/product-vision.md).

---

## **Product Backlog**
The backlog is managed in **GitHub Projects**. View the full backlog here:  
➡️ **[Backlog Link](YOUR-BACKLOG-TOOL-URL-HERE)**

🔹 **Backlog Prioritization Rationale** is documented in **[`docs/backlog-prioritization.md`](docs/backlog-prioritization.md)**.

---

## **Definition of Ready**
Each Product Backlog Item (PBI) must include:
- **Title**
- **User Story** (Follows the format: "As a user, I want to…")
- **Additional Details** (API integration, UI requirements, dependencies, etc.)
- **Story Point Estimation**
- **Acceptance Criteria**

📄 **Full details can be found in** [`docs/definition-of-ready.md`](docs/definition-of-ready.md).

---

## **Folder Structure**
- `frontend/` → Next.js & React frontend
- `backend/` → PostgreSQL & Prisma backend
- `docs/` → Documentation (Vision, Backlog, Definitions, etc.)
- `sprints/` → Sprint deliverables

---

## **Useful Links**
- **GitHub Repository**: [Repo Link](YOUR-GITHUB-REPO-URL-HERE)
- **GitHub Projects**: [Backlog Link](YOUR-BACKLOG-TOOL-URL-HERE)
- **Team Communication**: [Discord/Slack Invite](YOUR-TEAM-COMMS-LINK-HERE)

---

## **Setup Instructions (For Developers)**

### **1. Clone the Repository**
Open your terminal and run the following command to clone the project:
```sh
git clone https://github.com/YOUR-GITHUB-ORG/adventura.git
cd adventura
```

### **2. Install Frontend Dependencies**
Navigate to the frontend directory and install the required dependencies:
```sh
cd frontend
npm install
npm run dev
```

### **3. Set Up the Backend (PostgreSQL & Prisma)**
Navigate to the backend directory, install dependencies, and set up the database:
```sh
cd backend
npm install
npx prisma migrate dev
```

### **4. Run the Development Server**
After setting up both the frontend and backend, start the development environment:
```sh
npm run dev
```

### **5. Environment Variables**
Make sure you have a `.env` file set up with the necessary environment variables. Example:
```ini
# Backend .env file
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/your_database
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### **6. Linting & Formatting (Optional but Recommended)**
To maintain code quality, run the following commands before committing code:
```sh
npm run lint   # Check for linting issues
npm run format # Auto-format code
```

### **7. Running Tests**
To ensure the application is working as expected, run:
```sh
npm test
```


