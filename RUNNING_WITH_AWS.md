# Running the Application with AWS Backend

Your backend is now deployed on AWS! Here's how to run the application:

## 🌐 AWS Backend Details

**Backend URL:** http://54.84.139.95:8080
**API Endpoint:** http://54.84.139.95:8080/api

**Test it:**
```bash
curl http://54.84.139.95:8080/api/quotations/products
```

---

## 🚀 Option 1: Run Frontend Locally (Recommended for Development)

### Step 1: Navigate to Frontend
```bash
cd frontend
```

### Step 2: Install Dependencies (if not already done)
```bash
npm install
```

### Step 3: Run Development Server
```bash
npm run dev
```

The frontend will automatically connect to your AWS backend at `http://54.84.139.95:8080/api`

**Access the app:** http://localhost:5173

---

## 🌍 Option 2: Run Everything Locally

If you want to run the backend locally instead:

### Step 1: Start Local Backend
```bash
cd Backend/quotation-service
./start.bat
```

### Step 2: Update Frontend to Use Local Backend
Edit `frontend/.env.development`:
```
VITE_API_URL=http://localhost:8080/api
```

### Step 3: Start Frontend
```bash
cd frontend
npm run dev
```

---

## 📦 Option 3: Build and Deploy Frontend

### Build for Production
```bash
cd frontend
npm run build
```

This creates a `dist` folder with optimized production files.

### Deploy Options:

#### A. Deploy to Netlify (Free)
1. Go to https://netlify.com
2. Drag and drop the `frontend/dist` folder
3. Done! Your frontend is live

#### B. Deploy to Vercel (Free)
```bash
npm install -g vercel
cd frontend
vercel
```

#### C. Deploy to AWS S3 + CloudFront
See AWS_FRONTEND_DEPLOYMENT.md for detailed instructions

---

## 🔧 Environment Variables

The frontend uses these environment variables:

- **Development:** Uses `frontend/.env.development`
  - Default: `http://localhost:8080/api`

- **Production:** Uses `frontend/.env.production`
  - Default: `http://54.84.139.95:8080/api`

To override, create a `.env.local` file:
```
VITE_API_URL=http://your-custom-backend-url/api
```

---

## 🧪 Testing the Connection

### Test Backend Directly
```bash
# Get products
curl http://54.84.139.95:8080/api/quotations/products

# Create a quotation
curl -X POST http://54.84.139.95:8080/api/quotations \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "test123",
    "companyName": "Test Company",
    "contactPerson": "John Doe",
    "email": "john@test.com",
    "phone": "1234567890",
    "items": [{"productId": 1, "quantity": 5}]
  }'
```

### Test Frontend
1. Open http://localhost:5173
2. Navigate to "Request Quotation"
3. Fill in the form and submit
4. Check if the quotation is created successfully

---

## 🐛 Troubleshooting

### CORS Errors
If you see CORS errors in the browser console, the backend CORS configuration needs to be updated.

**Current CORS config allows:**
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (React dev server)

To add more origins, update `Backend/quotation-service/src/main/java/com/starbag/inventory/config/CorsConfig.java`

### Connection Refused
- Check if the AWS backend is running: `curl http://54.84.139.95:8080/api/quotations/products`
- Check AWS ECS service status in AWS Console

### Backend Not Responding
```bash
# Check ECS service status
aws ecs describe-services --cluster quotation-cluster --services quotation-service --region us-east-1

# Check logs
aws logs tail /ecs/quotation-service --follow --region us-east-1
```

---

## 💰 AWS Costs

**Current Setup:**
- **Free Tier (12 months):** $0/month
- **After Free Tier:** ~$30-40/month

**To Stop AWS Services (to avoid charges):**
```bash
# Stop ECS service
aws ecs update-service --cluster quotation-cluster --service quotation-service --desired-count 0 --region us-east-1

# Stop RDS database
aws rds stop-db-instance --db-instance-identifier quotation-db --region us-east-1
```

**To Restart:**
```bash
# Start ECS service
aws ecs update-service --cluster quotation-cluster --service quotation-service --desired-count 1 --region us-east-1

# Start RDS database
aws rds start-db-instance --db-instance-identifier quotation-db --region us-east-1
```

---

## 📝 Quick Start Commands

### Development (Frontend + AWS Backend)
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

### Production Build
```bash
cd frontend
npm run build
# Deploy the 'dist' folder to your hosting service
```

---

## 🎯 Next Steps

1. **Test the application** - Make sure everything works
2. **Deploy frontend** - Use Netlify, Vercel, or AWS S3
3. **Setup custom domain** - Point your domain to the frontend
4. **Enable HTTPS** - Use AWS Certificate Manager or Cloudflare
5. **Setup CI/CD** - Automate deployments with GitHub Actions

---

**Your backend is live at:** http://54.84.139.95:8080 🚀
