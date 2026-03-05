# Testing Your Application

## ✅ Current Status

**Backend (AWS):** http://34.229.72.186:8080/api ✅ RUNNING
**Frontend (Local):** http://localhost:8080 ✅ RUNNING

---

## 🚀 Quick Start

Your application is now running! Open your browser:

**👉 http://localhost:8080**

---

## 🧪 Test Scenarios

### 1. Test Product List (Backend Connection)
1. Open http://localhost:8080
2. Navigate to "Request Quotation" page
3. You should see a list of products loaded from AWS backend
4. If products load, backend connection is working! ✅

### 2. Test Create Quotation (User Flow)
1. Go to "Request Quotation"
2. Fill in the form:
   - Company Name: Test Company
   - Contact Person: John Doe
   - Email: john@test.com
   - Phone: 1234567890
3. Select products and quantities
4. Click "Submit Quotation"
5. You should see success message ✅

### 3. Test View Quotations (User)
1. Go to "My Quotations" page
2. Enter email: john@test.com
3. Click "Search"
4. You should see the quotation you just created ✅

### 4. Test Admin Panel
1. Go to "Admin" section
2. You should see all quotations
3. Click on a quotation to view details
4. Update prices and discounts
5. Click "Send to Customer" ✅

### 5. Test Accept Quotation (Customer)
1. Go back to "My Quotations"
2. Find a quotation with status "Sent"
3. Click "Accept"
4. Status should change to "Accepted" ✅

### 6. Test Convert to Order (Admin)
1. Go to Admin panel
2. Find an "Accepted" quotation
3. Click "Convert to Order"
4. Go to "Orders" page
5. You should see the new order ✅

---

## 🔍 Troubleshooting

### Problem: Products not loading

**Check backend:**
```bash
curl http://34.229.72.186:8080/api/quotations/products
```

If this fails, backend is down. Check AWS Console.

### Problem: CORS Error in Browser Console

**Error message:** "Access to fetch at 'http://34.229.72.186:8080/api/...' from origin 'http://localhost:8080' has been blocked by CORS policy"

**Solution:** The backend CORS needs to allow `http://localhost:8080`

**Current CORS config allows:**
- http://localhost:5173
- http://localhost:3000
- http://localhost:4200

**Need to add:** http://localhost:8080

**To fix:**
1. Update `Backend/quotation-service/src/main/java/com/example/quotation_service/config/CorsConfig.java`
2. Add `"http://localhost:8080"` to allowed origins
3. Rebuild and redeploy to AWS

### Problem: Frontend not loading

**Check if dev server is running:**
```bash
curl http://localhost:8080
```

**Restart frontend:**
```bash
cd frontend
npm run dev
```

### Problem: Backend IP changed

ECS tasks get new IPs when they restart. To get current IP:

```bash
# Get task ARN
aws ecs list-tasks --cluster quotation-cluster --service-name quotation-service --desired-status RUNNING --region us-east-1 --output text

# Get network interface
aws ecs describe-tasks --cluster quotation-cluster --tasks <TASK_ARN> --region us-east-1 --query 'tasks[0].attachments[0].details[?name==`networkInterfaceId`].value' --output text

# Get public IP
aws ec2 describe-network-interfaces --network-interface-ids <ENI_ID> --query 'NetworkInterfaces[0].Association.PublicIp' --output text --region us-east-1
```

Then update:
- `frontend/.env.development`
- `frontend/.env.production`
- `frontend/src/services/quotationApi.ts`

---

## 📊 Check Backend Logs

If something is not working, check backend logs:

```bash
aws logs tail /ecs/quotation-service --follow --region us-east-1
```

---

## 🎯 Expected Behavior

### User Journey:
1. User requests quotation → Status: DRAFT
2. Admin reviews and sends → Status: SENT
3. Customer accepts → Status: ACCEPTED
4. Admin converts → Status: CONVERTED (becomes Order)

### API Endpoints Working:
- ✅ GET /api/quotations/products - List products
- ✅ POST /api/quotations - Create quotation
- ✅ GET /api/quotations - List all quotations
- ✅ GET /api/quotations/search?email=xxx - Search by email
- ✅ GET /api/quotations/{id} - Get quotation details
- ✅ PUT /api/quotations/{id}/send - Update and send (Admin)
- ✅ PUT /api/quotations/{id}/accept - Accept quotation (Customer)
- ✅ POST /api/quotations/{id}/convert - Convert to order (Admin)
- ✅ GET /api/orders - List all orders
- ✅ GET /api/orders?email=xxx - Get orders by email

---

## 🐛 Known Issues

### Issue 1: CORS Error for localhost:8080

**Status:** ⚠️ Needs fix

**Symptom:** Browser console shows CORS error

**Temporary workaround:** 
- Change frontend port to 5173 in `vite.config.ts`
- OR update backend CORS and redeploy

**Permanent fix:**
1. Edit `Backend/quotation-service/src/main/java/com/example/quotation_service/config/CorsConfig.java`
2. Add `"http://localhost:8080"` to allowed origins
3. Rebuild: `mvn clean package -DskipTests`
4. Rebuild Docker: `docker build -t quotation-service .`
5. Push to ECR and redeploy

### Issue 2: Backend IP Changes

**Status:** ⚠️ Known limitation

**Symptom:** Backend stops responding after ECS task restart

**Solution:** Use Application Load Balancer (ALB) for stable endpoint

**Quick fix:** Get new IP and update frontend config

---

## 📝 Test Checklist

- [ ] Frontend loads at http://localhost:8080
- [ ] Products load from backend
- [ ] Can create new quotation
- [ ] Can search quotations by email
- [ ] Admin can view all quotations
- [ ] Admin can update prices and send
- [ ] Customer can accept quotation
- [ ] Admin can convert to order
- [ ] Orders page shows converted orders
- [ ] No CORS errors in browser console
- [ ] Backend logs show no errors

---

## 🎉 Success Criteria

Your application is working correctly if:

1. ✅ Frontend loads without errors
2. ✅ Products load from AWS backend
3. ✅ Can create and submit quotations
4. ✅ Can search and view quotations
5. ✅ Admin can manage quotations
6. ✅ Can convert quotations to orders
7. ✅ No CORS errors in console
8. ✅ Backend responds within 2 seconds

---

**Current Setup:**
- Backend: AWS ECS Fargate (http://34.229.72.186:8080)
- Database: AWS RDS MySQL (quotation-db.cotiiqy2i9ps.us-east-1.rds.amazonaws.com)
- Frontend: Local Vite Dev Server (http://localhost:8080)

**Next Steps:**
1. Test all features
2. Fix CORS if needed
3. Deploy frontend to production
4. Setup Application Load Balancer for stable backend URL
