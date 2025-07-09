# Trackify - Smart Subscription Tracker

A modern, secure web application to help you track and manage your subscriptions efficiently. Built with Next.js, TypeScript, and Google Cloud services.

![Trackify Dashboard](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Security](https://img.shields.io/badge/Security-Audited-green)

## 🚀 Features

- **🔐 Secure Authentication** - Google OAuth integration with NextAuth.js
- **📊 Smart Analytics** - Monthly spending charts and insights
- **📅 Calendar View** - Track upcoming subscription renewals
- **🔍 Advanced Filtering** - Filter by category, billing cycle, and amount
- **🛡️ Enterprise Security** - Google Secret Manager integration
- **📱 Responsive Design** - Works seamlessly on all devices
- **⚡ Real-time Updates** - Instant data synchronization

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS, Material UI
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL
- **Authentication:** NextAuth.js with Google OAuth
- **Security:** Google Secret Manager, JWT tokens
- **Deployment:** Vercel-ready

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- PostgreSQL database
- Google Cloud account with Secret Manager enabled
- Google OAuth credentials

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/trackify-app.git
cd trackify-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Google Secret Manager

Follow the [Google Secret Manager Setup Guide](GOOGLE_SECRET_MANAGER_SETUP.md) to configure your secrets.

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=./path/to/service-account-key.json

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
```

### 5. Set Up Database

```bash
# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔧 Configuration

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://your-domain.com/api/auth/callback/google` (production)

### Database Setup

The application uses PostgreSQL with Prisma ORM. Update your database connection in Google Secret Manager:

```bash
# Add database URL to Secret Manager
echo -n "postgresql://username:password@host:port/database" | gcloud secrets versions add DATABASE_URL --data-file=-
```

## 🏗️ Project Structure

```
trackify-app/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── dashboard/      # Dashboard pages
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   │   ├── auth/          # Authentication components
│   │   ├── dashboard/     # Dashboard components
│   │   ├── subscriptions/ # Subscription management
│   │   └── charts/        # Analytics components
│   ├── lib/               # Utility functions
│   │   ├── database.ts    # Database connection
│   │   ├── secrets.ts     # Secret Manager integration
│   │   └── security.ts    # Security utilities
│   └── types/             # TypeScript type definitions
├── prisma/                # Database schema and migrations
├── public/                # Static assets
└── docs/                  # Documentation
```

## 🔒 Security Features

- **Secret Management:** All sensitive data stored in Google Secret Manager
- **Authentication:** Secure OAuth 2.0 flow with Google
- **Input Validation:** Comprehensive validation on all API endpoints
- **SQL Injection Protection:** Prisma ORM with parameterized queries
- **XSS Protection:** Next.js built-in sanitization
- **CORS Protection:** Proper CORS configuration
- **Error Handling:** Secure error responses without information disclosure

## 📚 Documentation

- [Setup Guide](SETUP.md) - Detailed setup instructions
- [Security Audit](SECURITY_AUDIT_FINAL.md) - Security assessment report
- [Google Secret Manager Setup](GOOGLE_SECRET_MANAGER_SETUP.md) - Secret management configuration

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

```bash
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=your-service-account-key
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-nextauth-secret
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Check the [Setup Guide](SETUP.md)
- Review the [Security Audit](SECURITY_AUDIT_FINAL.md)
- Open an issue on GitHub

## 🔄 Changelog

### v1.0.0 (Current)
- Initial release with core subscription tracking features
- Google OAuth authentication
- Advanced filtering and analytics
- Google Secret Manager integration
- Security audit completed

---

**Built with ❤️ using Next.js and Google Cloud**
