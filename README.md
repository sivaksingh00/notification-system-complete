# Tenant-Aware Notification System

This repository contains my submission for the **Full-Stack Notification System Challenge**.

The complete project is located inside the **notification-system** folder.

---

## About the Project

The goal of this challenge was to build a complete notification system similar to what is used in modern CRM products.

Instead of building only the frontend or only the backend, the idea was to implement the complete flow:

```
An event happens
        ↓
A notification is created
        ↓
It is stored in the database
        ↓
The correct user receives it
        ↓
The user can mark it as read
```

The project also demonstrates **tenant isolation**, ensuring that one organization can never access another organization's notifications.

---

## What's Included

The complete implementation can be found inside:

```
notification-system/
```

It contains:

- Backend (Node.js + Express + TypeScript)
- Frontend (React + TypeScript)
- SQLite database using Prisma
- Notification APIs
- Demo trigger endpoints
- Automated tests
- Project documentation

---

## Features

### Backend

- Create notifications
- List notifications
- Unread notification count
- Mark individual notification as read
- Mark all notifications as read
- Tenant-aware access control
- Seed data
- Automated tests

### Frontend

- Notification bell
- Unread badge
- Notification dropdown
- Relative timestamps
- Read / unread state
- Polling for new notifications
- Demo for switching tenant and user

---

## Demo Events

To demonstrate the complete notification pipeline, two sample events have been implemented.

- **Member Invited** → Creates a tenant-wide notification.
- **Creator Replied** → Creates a notification for a specific user.

These events simulate how notifications would be generated inside a real CRM.

---

## Live Demo

The complete application is deployed and can be tested using the links below.

- **Frontend:** [Open the live application](https://notification-system-complete.vercel.app)
- **Backend health check:** [Check backend status](https://notification-system-api-rykw.onrender.com/health)
- **Source code:** [View the GitHub repository](https://github.com/sivaksingh00/notification-system-complete)

> The backend is hosted on Render's free tier, so the first request may take a short time while the service wakes up.

## Project Structure

```
notification-system/
│
├── backend/
├── frontend/
├── README.md
├── INTEGRATION_WRITEUP.md
├── MORE_TIME.md
└── POSTMAN_REQUESTS.md
```

---

## How to Run

Open the **notification-system** folder and follow the setup instructions provided in its README file.

The project includes everything needed to run the backend, frontend, database, and tests.

---

## Additional Document

The project also includes:

- Integration write-up
- Notes on future improvements
- Postman requests for API testing

---

## Team

- **Sivak** – Full-stack development,backend, frontend.
- **Ayush** – Testing and project review, architecture.
- **Zasefa** – Validation and documentation review.
- **Rishabh** – Testing and repository review.

---

Thank you for taking the time to review our submission.

We enjoyed building this project and hope it clearly demonstrates our understanding of designing and implementing a complete end-to-end notification system.
