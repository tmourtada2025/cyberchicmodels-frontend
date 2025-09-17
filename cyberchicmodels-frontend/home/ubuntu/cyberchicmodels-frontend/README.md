# CyberChicModels.ai - Frontend

A cutting-edge digital modeling agency platform powered by AI-generated models and automated fashion content creation.

## 🚀 Features

- **AI-Generated Models**: Create realistic digital models using advanced biometric JSON specifications
- **Automated Collections**: Generate professional photoshoots with different creative director styles
- **Fashion Catalog**: Automatically extract and sell individual clothing items from model collections
- **Video Content**: Generate TikTok-ready videos for social media marketing
- **Trend Analysis**: Automated model creation based on current fashion and social media trends
- **E-commerce Integration**: Stripe and PayPal payment processing
- **HubSpot Integration**: CRM and marketing automation
- **LoRA Training**: Consistent facial features across all poses and scenarios

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Routing**: React Router
- **Icons**: Lucide React
- **Payments**: Stripe
- **HTTP Client**: Axios

## 🏗 Architecture

- **Frontend**: Deployed on Vercel, code hosted on GitHub
- **Backend**: Google Cloud Run (API server)
- **Database**: Google Cloud SQL (PostgreSQL)
- **Storage**: Google Cloud Storage (images, videos, media)
- **CDN**: Google Cloud CDN for fast global delivery

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Cloud account (for backend services)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/tmourtada2025/cyberchicmodels-frontend.git
cd cyberchicmodels-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Update the environment variables in `.env.local`:
```env
VITE_API_BASE_URL=https://your-api-url.run.app
VITE_GCS_BUCKET_URL=https://storage.googleapis.com/your-bucket-name
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
VITE_HUBSPOT_PORTAL_ID=your_hubspot_portal_id
```

5. Start the development server:
```bash
npm run dev
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── AdminDashboard.tsx
│   ├── ModelCard.tsx
│   ├── ModelsPage.tsx
│   └── ...
├── lib/                # Utilities and services
│   ├── api.ts          # API service layer
│   ├── storage.ts      # Google Cloud Storage utilities
│   └── supabase.ts     # Legacy type definitions
├── store/              # Redux store and slices
│   ├── cartSlice.ts
│   ├── favoritesSlice.ts
│   └── store.ts
└── App.tsx             # Main application component
```

## 🎨 Key Features

### AI Model Generation
- JSON-based biometric specifications
- Consistent facial features across all poses
- LoRA training for perfect consistency
- Automated trend-based model creation

### Creative Director System
- Multiple director styles (minimalist, glamour, editorial, etc.)
- Automated photoshoot generation
- Cohesive collection narratives
- Professional quality outputs

### Fashion Catalog
- Automatic outfit extraction from model photos
- Metal mannequin product shots
- Multiple color variations
- Affiliate marketing integration

### Admin Dashboard
- Embedded chat interface with AI assistant
- Model and collection management
- Automated workflow controls
- Analytics and reporting

## 🗄️ Database Schema

The application uses Google Cloud SQL with optimized tables:

- **models** - AI model profiles with JSON biometric data
- **collections** - Photo collections with images stored as arrays
- **styles** - Fashion items with mannequin renders
- **outfit_items** - Extracted clothing items from collections
- **automated_trends** - Trend analysis and generated models

## 🚀 Deployment

The application is configured for automatic deployment to Vercel:

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for styling
- Component-based architecture

## 📝 License

This project is proprietary software. All rights reserved.

## 🤝 Contributing

This is a private project. Contact the development team for contribution guidelines.

## 📞 Support

For technical support or questions, please contact the development team.

---

Built with ❤️ for the future of digital fashion and AI-powered creativity
