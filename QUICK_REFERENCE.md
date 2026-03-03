# Payment Management System - Quick Reference Card

## 🚀 Quick Start Commands

### Start Everything
```bash
# Terminal 1 - Backend
cd Backend/Payment-Management-Service
mvnw spring-boot:run

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### Access Application
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8085/api`
- Database: `localhost:3306/payment_management_db`

---

## 📁 Key Files

### Frontend
- **API Service**: `frontend/src/services/paymentApi.ts`
- **Context**: `frontend/src/contexts/PaymentContext.tsx`
- **Page**: `frontend/src/pages/Payments.tsx`
- **Config**: `frontend/.env`

### Backend
- **Controllers**: `Backend/Payment-Management-Service/src/main/java/com/starbag/Payment_Management_Service/controller/`
- **Services**: `Backend/Payment-Management-Service/src/main/java/com/starbag/Payment_Management_Service/service/`
- **Entities**: `Backend/Payment-Management-Service/src/main/java/com/starbag/Payment_Management_Service/entity/`
- **Config**: `Backend/Payment-Management-Service/src/main/resources/application.properties`

### Database
- **Setup Script**: `Backend/Payment-Management-Service/database/create_database.sql`
- **Windows Setup**: `Backend/Payment-Management-Service/database/setup_mysql.bat`

---

## 🔧 Common Commands

### Frontend
```bash
npm install              # Install dependencies
npm run dev             # Start dev server
npm run build           # Build for production
npm run lint            # Check code quality
npm test                # Run tests
```

### Backend
```bash
mvnw spring-boot:run    # Start application
mvnw clean compile      # Clean and compile
mvnw test               # Run tests
mvnw package            # Create JAR file
```

### Database
```bash
mysql -u root -p                    # Connect to MySQL
USE payment_management_db;          # Select database
SHOW TABLES;                        # List tables
SELECT * FROM payments;             # View payments
SELECT * FROM saved_payment_methods; # View saved methods
```

---

## 🌐 API Endpoints

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments` | Create payment |
| GET | `/api/payments` | List payments |
| GET | `/api/payments/{id}` | Get payment |
| PUT | `/api/payments/{id}` | Update payment |
| PATCH | `/api/payments/{id}/status` | Update status |
| DELETE | `/api/payments/{id}` | Delete payment |
| GET | `/api/payments/summary` | Get statistics |

### Saved Methods
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payment-methods` | Add method |
| GET | `/api/payment-methods` | List methods |
| PUT | `/api/payment-methods/{id}` | Update method |
| PATCH | `/api/payment-methods/{id}/status` | Set status |
| DELETE | `/api/payment-methods/{id}` | Delete method |

---

## 🧪 Quick Tests

### Test Backend
```bash
# Get all payments
curl http://localhost:8085/api/payments

# Create payment
curl -X POST http://localhost:8085/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "ORD-TEST",
    "customerName": "Test User",
    "amount": 100,
    "method": "CARD",
    "status": "PENDING",
    "paymentDate": "2024-01-15",
    "txnRef": "TXN-TEST"
  }'
```

### Test Frontend
1. Open `http://localhost:5173`
2. Navigate to Payments page
3. Click "Record Payment"
4. Fill form and submit
5. Verify success toast appears

---

## 🐛 Troubleshooting

### Frontend won't start
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend won't start
```bash
# Check MySQL is running
mysql -u root -p

# Check port 8085 is free
netstat -ano | findstr :8085

# Restart backend
cd Backend/Payment-Management-Service
mvnw clean spring-boot:run
```

### Can't connect to backend
1. Verify backend is running: `curl http://localhost:8085/api/payments`
2. Check API URL in `frontend/src/services/paymentApi.ts`
3. Check browser console for CORS errors
4. Verify CORS is enabled in backend

### Axios not found
```bash
cd frontend
npm install axios
npm run dev
```

---

## 📊 Data Mapping

### Payment Method
- Frontend: `card`, `cash`, `online_transfer`
- Backend: `CARD`, `CASH`, `ONLINE_TRANSFER`

### Payment Status
- Frontend: `pending`, `completed`, `failed`
- Backend: `PENDING`, `COMPLETED`, `FAILED`

---

## 🔐 Default Credentials

### Database
- Host: `localhost:3306`
- Database: `payment_management_db`
- Username: `root`
- Password: `root` (change in production!)

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `QUICK_START.md` | 3-step startup guide |
| `PAYMENT_BACKEND_SETUP.md` | Complete setup instructions |
| `INTEGRATION_CHECKLIST.md` | Testing checklist |
| `TROUBLESHOOTING.md` | Common issues and solutions |
| `API_DOCUMENTATION.md` | Backend API reference |
| `CARD_MANAGEMENT_GUIDE.md` | Card feature implementation |

---

## ✅ Health Check

### Backend Healthy
- ✅ Starts without errors
- ✅ Responds to `curl http://localhost:8085/api/payments`
- ✅ Database connection successful
- ✅ No errors in logs

### Frontend Healthy
- ✅ Starts without errors
- ✅ Loads at `http://localhost:5173`
- ✅ No console errors (F12)
- ✅ Payments page loads data

### Integration Healthy
- ✅ Can create payment
- ✅ Can update payment
- ✅ Can delete payment
- ✅ Toast notifications work
- ✅ Statistics update correctly

---

## 🎯 Next Steps

1. ✅ **System is running** - You're here!
2. 📝 **Test all features** - Use INTEGRATION_CHECKLIST.md
3. 🎨 **Implement card management** - Follow CARD_MANAGEMENT_GUIDE.md
4. 🔒 **Add authentication** - Secure the admin panel
5. 🚀 **Deploy to production** - When ready

---

## 💡 Pro Tips

1. **Enable debug mode** - Set `VITE_API_DEBUG=true` in `.env`
2. **Use browser DevTools** - F12 to debug issues
3. **Check Network tab** - See all API calls
4. **Monitor backend logs** - Watch for errors
5. **Keep documentation handy** - Reference guides as needed

---

## 🆘 Need Help?

1. Check `TROUBLESHOOTING.md` for common issues
2. Review browser console (F12) for errors
3. Check backend logs for errors
4. Verify all services are running
5. Test API endpoints with curl

---

## 📞 Support Resources

- **Frontend Issues**: Check browser console and Network tab
- **Backend Issues**: Check terminal logs and database
- **Database Issues**: Use MySQL Workbench or command line
- **Integration Issues**: Verify both services are running

---

**Last Updated**: After axios installation
**Status**: ✅ Fully Operational

Happy coding! 🚀
