# Fluenzy AI

Advanced AI Training Features - A comprehensive interview preparation platform built with Next.js, Tailwind CSS, and Framer Motion.

## Features

- 🎯 AI Interviewer for technical and HR rounds
- 📚 English learning with daily conversations
- 👥 Group Discussion practice with AI participants
- 🏢 Company-specific preparation tracks
- 🔐 User authentication with Google OAuth
- 📊 Progress tracking and analytics
- 💳 Pro subscription with unlimited sessions
- 📱 Responsive design

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file with:
   ```env
   # Database
   DATABASE_URL="mongodb://localhost:27017/pixora"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   
   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # ImageKit
   IMAGEKIT_PUBLIC_KEY="your-imagekit-public-key"
   IMAGEKIT_PRIVATE_KEY="your-imagekit-private-key"
   IMAGEKIT_URL_ENDPOINT="your-imagekit-url-endpoint"
   
   # Razorpay
   RAZORPAY_API_KEY="your-razorpay-api-key"
   RAZORPAY_API_SECRET="your-razorpay-api-secret"
   ```

3. **Set up database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

## Usage Limits

- **Free Plan:** 5 interview sessions per month
- **Pro Plan:** Unlimited interview sessions
- Users are prompted to upgrade when they reach their limit

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

