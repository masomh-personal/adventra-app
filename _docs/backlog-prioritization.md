# 🗂️ Backlog Prioritization Order

## 1. Create Entities / ERD
Before we can start system design, we must clearly define our **entities** and determine **how they interact** with one another.

---

## 2. Create UML Diagram
Once our entities are finalized, we can begin **designing our system architecture**. Doing this early provides a **strong foundation** for development.

---

## 3. Design Database
Designing the database **before creation** helps us avoid issues that could force structural changes later. This includes defining schema, constraints, and relationships.

---

## 4. Design Header / Footer & Standard Page Layout
Early design of reusable components like **header and footer** establishes a **consistent layout** for all pages, saving rework later.

---

## 5. Create Homepage
The homepage is the **first impression** for users. Prioritizing it helps define our **visual identity and user flow** early on.

---

## 6. Create Profile Page
A **clean, intuitive registration page** is key. We aim for easy navigation and user-friendly design.

---

## 7. Implement Create Profile Functionality
Implementing profile creation, validation, and database interaction is essential. Some functionality/code here can be **reused for login**.

---

## 8. Create User Login Page
The **next logical step** is user login. Design-wise, it should align with the **registration page** for consistency.

---

## 9. Implement Login Functionality
Make the login functional and secure. We can reuse parts of the **profile creation logic** to save time.

---

## 10. Create Matching Page
After login, users should be able to **discover and match** with others. This UI must be intuitive as users spend **significant time here**.

---

## 11. Implement Matching Functionality
This will be **time-intensive** and requires careful planning. With necessary pages built, we can now focus on implementing **matching logic and algorithms**.

---

## 12. Create Messaging Page
After matching, users need a way to **communicate**. Designing a **chat UI** is critical for real-time interaction.

---

## 13. Implement Messaging Functionality
Make the chat functional. We can **reuse query logic** from earlier pages for efficiency.

---

## 14. Create Manage Profile Page
Users should be able to **view/edit their profiles**. This page will reuse the **registration page UI** with update capabilities.

---

## 15. Connect Profiles to Social Media
Allow users to **link social media** accounts. This can be added to the **Manage Profile page** with simple queries.

---

## 16. Implement User Reporting & Blocking
Users must be able to **report or block** others. This feature will store actions in the database, **similar to messaging**.

---

## 17. Implement User Status & Availability
Add **status toggles** (e.g., Active, Busy, Offline) in profiles. Quick implementation, with **real-time indicators** across the app.

---
