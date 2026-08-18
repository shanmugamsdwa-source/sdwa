# Salem District Weightlifting Association (SDWA) Web Platform

Official dynamic web portal and authenticated Content Management System (CMS) for the **Salem District Weightlifting Association (SDWA)**, affiliated with the **Tamil Nadu State Weightlifting Association (TNSWA)**. Registered under **Reg. No: 112 / 2020**.

---

## 1. Technology Stack

- **Framework**: Next.js 16 (App Router with SSR / Client Components)
- **Styling**: Tailwind CSS 4, Vanilla CSS Custom Properties (Theme tokens)
- **Typography**: Google Fonts (`Cinzel`, `Oswald`, `Inter`, `JetBrains Mono`)
- **Smooth Scrolling**: Lenis Smooth Scroll
- **Database & Auth**: Google Firebase Client SDK & Cloud Firestore with Security Rules
- **Media Management**: Cloudinary (Image uploads, optimizations, CDN delivery)
- **Email Delivery**: Resend API (Server-side contact enquiry routing)
- **Deployment Platform**: Vercel

---

## 2. System Architecture

```
                                  ┌───────────────────────────┐
                                  │   Public Website (SSR)    │
                                  │    • Home, About, Tourn.  │
                                  │    • Achiev., Academies   │
                                  │    • Gallery, Contact     │
                                  └─────────────┬─────────────┘
                                                │
                                                ▼
┌───────────────────────────┐     ┌───────────────────────────┐     ┌───────────────────────────┐
│   Admin CMS Dashboard     │────▶│    Firebase Client SDK    │◀───▶│   Cloudinary CDN / API    │
│   • Auth, Tournaments     │     │ (Firestore Security Rules)│     │   (Posters, Logos, Media) │
│   • Achievements, Photos  │     └─────────────┬─────────────┘     └───────────────────────────┘
│   • Committee, Settings   │                   │
└───────────────────────────┘                   ▼
                                  ┌───────────────────────────┐
                                  │     Google Firestore      │
                                  │  (NoSQL Dynamic Database) │
                                  └─────────────┬─────────────┘
                                                │
                                                ▼
                                  ┌───────────────────────────┐
                                  │   Resend Transactional    │
                                  │  (Secretariat Email API)  │
                                  └───────────────────────────┘
```

---

## 3. Getting Started (Local Development)

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd SDWA

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your Firebase, Cloudinary, and Resend credentials

# Run development server
npm run dev
```

Visit `http://localhost:3000` to view the public site or `http://localhost:3000/admin/login` for the admin portal.

---

## 4. Environment Variables Configuration

| Variable | Description | Required |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Client Web API Key | Yes |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | Yes |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID | Yes |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`| Firebase Storage Bucket | Yes |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Sender ID | Yes |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase Web App ID | Yes |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | Yes |
| `RESEND_API_KEY` | Resend API Key for Email Delivery | Yes |
| `NEXT_PUBLIC_BASE_URL` | Canonical Site URL (`https://sdwa.in`) | Yes |

---

## 5. Firestore Database Security Rules

Security rules are managed via `firestore.rules` and authenticate administrators by matching their UID against documents in the `admins` collection (`admins/{uid}` with `isAdmin: true`):

```bash
firebase deploy --only firestore:rules
```

---

## 6. Cloudinary Folder Structure

Assets uploaded via the CMS are organized into specific namespaces:

```text
sdwa/
├── branding/         # Association emblems and crests
├── committee/        # Portrait photos of executive office bearers
├── achievements/     # Championship podium & certificate captures
├── tournaments/      # Official tournament flyers & posters
├── institutions/     # Academy and gym logos
└── gallery/          # Championship photo albums
```

---

## 7. Vercel Production Deployment

1. Connect repository in [Vercel Dashboard](https://vercel.com).
2. Configure build settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
3. Add all environment variables listed in Section 4. (No `FIREBASE_PRIVATE_KEY` needed!)
4. Deploy and map domain (`sdwa.in` and `www.sdwa.in`).
