### Contact Management App
A full-stack contact management application that allows users to create, update, delete, search, and organize contacts into groups.

Built with a modern PERN stack (PostgreSQL, Express, React, Node.js), this project demonstrates full CRUD functionality, many-to-many relationships, reusable UI components, and both frontend and backend testing.

### 🚀 Features
**📌 Contacts**
- View all contacts in a card-based UI
- View detailed contact information in a modal
- Add new contacts
- Edit existing contacts
- Delete contacts with confirmation

**🏷️ Groups**
- Assign contacts to one or multiple groups
- View contacts grouped by category on the Groups page
- Many-to-many relationship via junction table

**🔍 Search**
- Search contacts by:
  - Name
  - Email
  - Phone
  - Notes
  - Group name
- Case-insensitive fuzzy search using SQL (ILIKE)
![ScreenRecording2026-03-27at1 48 29AM-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/9aaa68d9-74d9-469b-a92f-112a8e6b7449)

## CRUD Operations
**Contacts**
- `GET /api/contacts` → Get all contacts
- `GET /api/contacts/:id` → Get one contact
- `POST /api/contacts` → Create contact
- `PUT /api/contacts/:id` → Update contact
- `DELETE /api/contacts/:id` → Delete contact
**Groups**
- `GET /api/groups` → Get all groups with contacts

### 🛠️ Tech Stack
- Frontend
  - React (Vite)
  - CSS (custom styling)
  - React Toastify
- Backend
  - Node.js
  - Express.js
  - PostgreSQL
- Testing
  - Vitest
  - React Testing Library
  - API tests using fetch

### How to test
1. Clone the repository: `git clone https://github.com/sylviajsy/contact-list.git`
2. Set Up the Backend
  - `cd server`
  - `npm install`
3. Inside your server folder, create an `.env` file with `touch .env`
4. There are two ways to restore the DB dump file the project already contains:
     A. If you have postgres set up postgres with an User:
         - just run the command `psql -U postgres techtonica -f db.sql`. Make sure that you have your Postgres password on hand. The psql console will ask for your password.
      B. If your initial configuration of postgres doesn't require a User:
          - just run the command `psql techtonica -f db.sql`
6. Inside your server folder, open the file `.env.example` and copy the correct option for your configuration found there to your new `.env` file.
7. Go to the `client` folder in the project (`cd .. and cd client`) and run the command `npm install`
8. If you want to run both servers using concurrently (which is already a npm dependency on the server) you can keep the script in the package.json in the server that reads `"dev": " concurrently 'npm start' 'cd .. && cd client && npm run dev' "`. If you run the command `npm run dev` from within your server, both the client and backend servers will start.
9. Go to `http://localhost:5173/` and you should see something like this💪
<img width="1128" height="594" alt="Screenshot 2026-03-23 at 10 09 04 PM" src="https://github.com/user-attachments/assets/cd0f144f-8665-473b-9383-9c5b5cda53d9" />
