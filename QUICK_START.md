# 🚀 Quick Start Guide

## Your Application is Ready!

**Backend (AWS):** http://13.219.204.52:8080/api ✅  
**Frontend (Local):** http://localhost:8080 ✅

---

## ▶️ Start Testing Now

### 1. Open Your Browser
```
http://localhost:8080
```

### 2. Test the Application

#### Create a Quotation (User)
1. Click "Request Quotation"
2. Fill in the form:
   - Company Name: Test Company
   - Contact Person: John Doe
   - Email: test@example.com
   - Phone: 1234567890
3. Select products and quantities
4. Click "Submit Quotation"

#### View Quotations (User)
1. Go to "My Quotations"
2. Enter email: test@example.com
3. Click "Search"
4. You should see your quotation!

#### Admin Panel
1. Go to "Admin" section
2. View all quotations
3. Click on a quotation
4. Update prices/discounts
5. Click "Send to Customer"

#### Accept Quotation (Customer)
1. Go back to "My Quotations"
2. Find quotation with status "Sent"
3. Click "Accept"

#### Convert to Order (Admin)
1. Go to Admin panel
2. Find "Accepted" quotation
3. Click "Convert to Order"
4. Check "Orders" page

---

## 🧪 Quick Backend Test

Test if backend is working:

```bash
curl http://13.219.204.52:8080/api/quotations/products
```

You should see a list of products in JSON format.

---

## ⚠️ Important Notes

### CORS Configuration
The backend CORS is configured to allow:
- http://localhost:8080 ✅
- http://localhost:5173
- http://localhost:3000

If you get CORS errors, you need to rebuild and redeploy the backend with the updated CORS config.

### Backend IP Changes
ECS tasks get new IPs when they restart. If the backend stops working:

1. Get new IP:
```bash
# List running tasks
aws ecs list-tasks --cluster quotation-cluster --service-name quotation-service --desired-status RUNNING --region us-east-1

# Get task details (replace TASK_ID)
aws ecs describe-tasks --cluster quotation-cluster --tasks TASK_ID --region us-east-1 --query 'tasks[0].attachments[0].details[?name==`networkInterfaceId`].value' --output text

# Get public IP (replace ENI_ID)
aws ec2 describe-network-interfaces --network-interface-ids ENI_ID --query 'NetworkInterfaces[0].Association.PublicIp' --output text --region us-east-1
```

2. Update these files:
   - `frontend/.env.development`
   - `frontend/.env.production`
   - `frontend/src/services/quotationApi.ts`

3. Restart frontend:
```bash
# Stop current dev server (Ctrl+C in terminal)
cd frontend
npm run dev
```

---

## 🐛 Troubleshooting

### Products not loading?
- Check browser console for errors
- Test backend: `curl http://13.219.204.52:8080/api/quotations/products`
- Check if backend IP changed

### CORS Error?
- Backend needs to be redeployed with updated CORS config
- See `Backend/quotation-service/CORS_CONFIGURATION.md`

### Frontend not loading?
- Make sure dev server is running
- Check terminal for errors
- Try restarting: `npm run dev` in frontend folder

---

## 📊 Check Status

### Frontend Status
Your frontend dev server should show:
```
VITE v5.4.21  ready in 676 ms
➜  Local:   http://localhost:8080/
```

### Backend Status
```bash
# Check ECS service
aws ecs describe-services --cluster quotation-cluster --services quotation-service --region us-east-1 --query 'services[0].{Status:status,Running:runningCount}'

# Check logs
aws logs tail /ecs/quotation-service --follow --region us-east-1
```

---

## 🎯 Test Checklist

- [ ] Frontend loads at http://localhost:8080
- [ ] Products load on "Request Quotation" page
- [ ] Can create new quotation
- [ ] Can search quotations by email
- [ ] Admin can view all quotations
- [ ] Admin can update and send quotations
- [ ] Customer can accept quotations
- [ ] Admin can convert to orders
- [ ] Orders page shows converted orders

---

## 📝 API Endpoints

All working at: http://13.219.204.52:8080/api

- GET `/quotations/products` - List products
- POST `/quotations` - Create quotation
- GET `/quotations` - List all quotations
- GET `/quotations/search?email=xxx` - Search by email
- GET `/quotations/{id}` - Get quotation details
- PUT `/quotations/{id}/send` - Update and send (Admin)
- PUT `/quotations/{id}/accept` - Accept quotation (Customer)
- POST `/quotations/{id}/convert` - Convert to order (Admin)
- GET `/orders` - List all orders
- GET `/orders?email=xxx` - Get orders by email

---

## 🎉 You're All Set!

Your application is running and ready to test. Open http://localhost:8080 in your browser and start testing!

**Need help?** Check `TEST_APPLICATION.md` for detailed testing scenarios.

---

**Current Setup:**
- ✅ Backend: AWS ECS Fargate (http://13.219.204.52:8080)
- ✅ Database: AWS RDS MySQL
- ✅ Frontend: Vite Dev Server (http://localhost:8080)
- ✅ CORS: Configured for localhost:8080
