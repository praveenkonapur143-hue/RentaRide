# Publishing RentaRide to Vercel (Step-by-Step Guide)

Your code is completely prepared, tested, built, and pushed to your GitHub repository:  
**`https://github.com/praveenkonapur143-hue/RentaRide`**

Follow these 4 simple steps to publish RentaRide live to the web for free on Vercel:

---

## Step 1: Sign In to Vercel
1. Open your browser and go to **[vercel.com/signup](https://vercel.com/signup)** (or **[vercel.com/login](https://vercel.com/login)**).
2. Choose **"Continue with GitHub"** so Vercel connects with your GitHub account.

---

## Step 2: Import Your Repository
1. In your Vercel Dashboard, click the **"Add New..."** button (top right) and select **"Project"**.
2. Under **"Import Git Repository"**, you will see your repository list.
3. Locate **`praveenkonapur143-hue/RentaRide`** and click **"Import"**.

---

## Step 3: Configure Environment Variables (Optional)
Vercel will auto-detect **Next.js** framework with default settings:
- **Framework Preset**: `Next.js`
- **Root Directory**: `./`
- **Build Command**: `next build` (with automatic `prisma generate`)
- **Output Directory**: `.next`

Expand the **"Environment Variables"** section and add these variables for optimal security:

| Variable Name | Value | Purpose |
|---|---|---|
| `JWT_SECRET` | `rentaride-secure-jwt-secret-key-super-safe-random-phrase-32-chars-min` | Authenticates customer & staff JWT cookies |
| `NEXTAUTH_SECRET` | `rentaride-nextauth-secret-super-safe` | NextAuth session verification |
| `NEXT_PUBLIC_APP_URL` | `https://your-project-name.vercel.app` (or leave empty) | Public URL |

*(Note: If you don't connect a PostgreSQL database, RentaRide's resilient in-memory data store automatically provides all sample cars, customer profiles, instant bookings, and cancellation workflows out of the box).*

---

## Step 4: Click "Deploy"
1. Click the blue **"Deploy"** button.
2. Vercel will build your project in ~45–60 seconds.
3. Once completed, you will see confetti 🎉 and your live public URL (e.g. `https://rentaride.vercel.app` or `https://rentaride-praveen.vercel.app`).

---

## Automatic Continuous Deployment (CI/CD)
- Whenever you make changes or push to `main` via git, Vercel will automatically build and update your live website within seconds.
- Free SSL/HTTPS certificates and global CDN edge routing are managed automatically.
