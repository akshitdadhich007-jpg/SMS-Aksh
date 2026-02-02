Node.js Demo Backend

This demo runs a simple Express server with in-memory demo users and session-based login.

Demo credentials:
- Admin: admin@society.local / Admin@123456
- Resident: resident1@society.local / Resident@123

# Run locally:

```bash
cd fintech-platform
npm install
# copy .env.example to .env and update Supabase credentials
copy .env.example .env   # on Windows
# or on mac/linux: cp .env.example .env
npm start
```

Open: http://localhost:3000

Notes:
- This server now uses Supabase (Postgres). Create a Supabase project and run the SQL from `database/schema.sql` using the Supabase SQL editor or psql against your Postgres instance.
- Set `SUPABASE_URL` and `SUPABASE_KEY` in `.env` (use service role key for server operations if needed).
- Session secret should be changed in `.env` in production.
