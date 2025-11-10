# MedFlow - Setup and Installation Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- PostgreSQL or MySQL database
- Git

### Step 1: Clone and Install Dependencies

```bash
# Navigate to project directory
cd /home/bilel/Downloads/frontier/frontier-project

# Install dependencies
npm install
```

### Step 2: Database Setup

#### Option A: Using PostgreSQL (Recommended)

1. **Install PostgreSQL** (if not already installed):
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
```

2. **Create database**:
```bash
sudo -u postgres psql
CREATE DATABASE medflow;
CREATE USER medflow_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE medflow TO medflow_user;
\q
```

#### Option B: Using MySQL

1. **Install MySQL**:
```bash
sudo apt-get install mysql-server
```

2. **Create database**:
```bash
mysql -u root -p
CREATE DATABASE medflow;
CREATE USER 'medflow_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON medflow.* TO 'medflow_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 3: Environment Configuration

1. **Copy the example environment file**:
```bash
cp .env.example .env.local
```

2. **Edit `.env.local`** with your actual values:

```env
# Database (PostgreSQL example)
DATABASE_URL="postgresql://medflow_user:your_password@localhost:5432/medflow"

# Or MySQL
# DATABASE_URL="mysql://medflow_user:your_password@localhost:3306/medflow"

# NextAuth - Generate a secret with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-here"

# Stripe (Optional - use test keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."

# Email (Optional)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@medflow.com"
```

3. **Generate NextAuth secret**:
```bash
openssl rand -base64 32
```

Copy the output and paste it as `NEXTAUTH_SECRET` in your `.env.local` file.

### Step 4: Initialize Database

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations (creates tables)
npm run db:migrate

# Seed database with sample data
npm run db:seed
```

### Step 5: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Demo Login Credentials

After seeding, you can use these credentials:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@medflow.com | password123 |
| **Doctor 1** | dr.smith@medflow.com | password123 |
| **Doctor 2** | dr.jones@medflow.com | password123 |
| **Receptionist** | reception@medflow.com | password123 |
| **Patient 1** | lina.benali@email.com | password123 |
| **Patient 2** | ahmed.mohamed@email.com | password123 |

---

## 📦 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npm run db:generate      # Generate Prisma Client
npm run db:migrate       # Run database migrations
npm run db:push          # Push schema changes without migration
npm run db:seed          # Seed database with sample data
npm run db:studio        # Open Prisma Studio (database GUI)
```

---

## 🔧 Troubleshooting

### Database Connection Issues

**Error**: "Can't reach database server"

**Solution**:
1. Ensure PostgreSQL/MySQL is running:
   ```bash
   sudo systemctl status postgresql
   # or
   sudo systemctl status mysql
   ```

2. Start the database if it's not running:
   ```bash
   sudo systemctl start postgresql
   # or
   sudo systemctl start mysql
   ```

3. Check your `DATABASE_URL` in `.env.local`

### Prisma Migration Issues

**Error**: "Migration failed"

**Solution**:
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Then re-run migrations
npm run db:migrate
npm run db:seed
```

### Port Already in Use

**Error**: "Port 3000 is already in use"

**Solution**:
```bash
# Find and kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or run on a different port
PORT=3001 npm run dev
```

### NextAuth Errors

**Error**: "NEXTAUTH_SECRET is not set"

**Solution**:
1. Generate a secret: `openssl rand -base64 32`
2. Add it to `.env.local`:
   ```env
   NEXTAUTH_SECRET="your-generated-secret"
   ```
3. Restart the dev server

---

## 🗄️ Database Management

### Open Prisma Studio (Database GUI)

```bash
npm run db:studio
```

This opens a visual database editor at [http://localhost:5555](http://localhost:5555)

### View Database Tables

**PostgreSQL**:
```bash
sudo -u postgres psql medflow
\dt
SELECT * FROM "User";
\q
```

**MySQL**:
```bash
mysql -u medflow_user -p medflow
SHOW TABLES;
SELECT * FROM User;
EXIT;
```

### Reset Database

```bash
npx prisma migrate reset
npm run db:seed
```

---

## 🎨 Project Structure

```
frontier-project/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.js            # Seed data script
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   │   ├── auth/      # NextAuth endpoints
│   │   │   ├── patients/  # Patient CRUD
│   │   │   ├── appointments/
│   │   │   └── dashboard/
│   │   ├── auth/          # Auth pages (login, register)
│   │   ├── dashboard/     # Dashboard page
│   │   ├── patients/      # Patients page
│   │   ├── calendar/      # Calendar page
│   │   ├── layout.js      # Root layout
│   │   └── page.js        # Home page
│   ├── components/        # React components
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StatsCard.jsx
│   │   └── ...
│   └── lib/               # Utilities
│       ├── prisma.js      # Prisma client
│       └── auth.js        # Auth helpers
├── docs/                  # Documentation
├── .env.local             # Environment variables (create this)
├── .env.example           # Environment template
├── package.json
└── README.md
```

---

## 🌐 Deployment

### Deploy to Vercel

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Deploy**:
```bash
vercel
```

3. **Set environment variables** in Vercel dashboard

4. **Add production database URL**:
   - Use services like [Supabase](https://supabase.com/) or [Railway](https://railway.app/) for PostgreSQL

### Deploy to Other Platforms

- **Netlify**: Connect GitHub repo and configure build settings
- **Railway**: One-click deploy from GitHub
- **DigitalOcean**: Deploy as Node.js app

---

## 📚 Next Steps

1. ✅ **Complete remaining features**:
   - Patient management UI with forms
   - Interactive calendar with booking
   - Consultation and prescription system
   - Invoice management
   - Stripe payment integration

2. ✅ **Add testing**:
   ```bash
   npm install -D jest @testing-library/react @testing-library/jest-dom
   npm test
   ```

3. ✅ **Customize branding**:
   - Update `src/app/layout.js` metadata
   - Modify colors in Tailwind config
   - Add your clinic logo

4. ✅ **Security hardening**:
   - Enable CSRF protection
   - Add rate limiting
   - Implement proper error handling

---

## 🆘 Need Help?

- **Documentation**: Check the `/docs` folder
- **Prisma Docs**: https://www.prisma.io/docs
- **Next.js Docs**: https://nextjs.org/docs
- **NextAuth Docs**: https://next-auth.js.org/

---

## 📄 License

This project is for educational purposes as part of a React/Next.js learning project.

---

**MedFlow** - Modern Medical Practice Management Platform
Built with ❤️ using Next.js 14, Prisma, PostgreSQL, and Tailwind CSS
