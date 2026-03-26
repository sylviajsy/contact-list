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
