# 🚀 Quick Start - Run Everything in One Command

## One-Command Startup Options

### Option 1: Shell Script (Recommended) 🎯
```bash
./start.sh
```

### Option 2: NPM Command
```bash
npm run setup && npm run dev
```

### Option 3: Database Setup + Dev Server
```bash
npm run db:setup && npm run dev
```

## Available NPM Commands

### 🚀 Main Commands
| Command | Description |
|---------|-------------|
| `npm run setup` | Complete setup: Install deps + Generate Prisma + Push DB + Seed data |
| `npm run dev` | Start development server |
| `npm run dev:full` | Generate Prisma client + Start dev server |
| `./start.sh` | Run everything with shell script |

### 💾 Database Commands
| Command | Description |
|---------|-------------|
| `npm run db:setup` | Generate Prisma + Push schema + Seed data |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed database with initial data |
| `npm run db:migrate` | Run migrations (development) |
| `npm run db:studio` | Open Prisma Studio (database GUI) |

### 🏗️ Build & Production
| Command | Description |
|---------|-------------|
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## First Time Setup

If this is your first time running the project:

```bash
# Clone the repository (if not done yet)
git clone <repository-url>
cd frontier-project

# Run complete setup
npm run setup

# Start development server
npm run dev
```

## Quick Reset

To reset the database and start fresh:

```bash
# Delete the database
rm -f prisma/dev.db

# Recreate and seed
npm run db:setup

# Start server
npm run dev
```

## Login Credentials

After seeding, you can login with:

**Admin:**
- Email: `admin@medflow.com`
- Password: `password123`

**Doctors:**
- Email: `dr.smith@medflow.com` / `dr.jones@medflow.com`
- Password: `password123`

**Receptionist:**
- Email: `reception@medflow.com`
- Password: `password123`

**Patients:**
- Email: `lina.benali@email.com` / `ahmed.mohamed@email.com`
- Password: `password123`

## Troubleshooting

### Port 3000 Already in Use
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Database Issues
```bash
# Delete and recreate
rm -f prisma/dev.db
npm run db:push
npm run db:seed
```

### Prisma Client Issues
```bash
# Regenerate Prisma Client
npm run db:generate
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Development Workflow

### Daily Development
```bash
# Just start the dev server
npm run dev
```

### After Pulling Changes
```bash
# If schema.prisma changed
npm run db:generate

# If you want fresh data
npm run db:setup
```

### Adding New Features
```bash
# 1. Make changes to prisma/schema.prisma
# 2. Push changes
npm run db:push

# 3. Regenerate client
npm run db:generate

# 4. Update seed data if needed
npm run db:seed
```

## Environment Variables

Create a `.env.local` file if needed:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

## What Gets Installed

The setup process will:

1. ✅ Install all npm dependencies
2. ✅ Generate Prisma Client
3. ✅ Create SQLite database
4. ✅ Push database schema
5. ✅ Seed with sample data:
   - 3 clinics
   - 4 users (admin + doctors + receptionist)
   - 17 services
   - 4 patients
   - 3 appointments
   - 2 invoices
   - Notifications

## Next Steps

After running the project:

1. 🌐 Open http://localhost:3000
2. 🔐 Login with any credentials above
3. 📱 Test on mobile (responsive design)
4. 🏥 Explore all features:
   - Dashboard
   - Patient Management
   - Appointments
   - Consultations
   - Invoices
   - Calendar
   - Analytics
   - Notifications

## Project Structure

```
frontier-project/
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed.js            # Seed data
│   └── dev.db             # SQLite database
├── src/
│   ├── app/               # Next.js pages
│   ├── components/        # React components
│   └── lib/
│       └── api/           # Centralized API functions
├── start.sh               # Startup script
└── package.json           # NPM scripts
```

## Support

For issues or questions:
1. Check the error logs in the terminal
2. Verify all prerequisites are installed
3. Try the troubleshooting steps above
4. Check the documentation in `/docs`

---

**Happy Coding! 🎉**
