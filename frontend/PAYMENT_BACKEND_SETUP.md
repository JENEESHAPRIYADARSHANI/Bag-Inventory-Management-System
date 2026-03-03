# Payment Backend Integration Setup Guide

This guide explains how to connect the frontend admin panel to the Payment Management Service backend.

## What's Been Done

✅ **API Service Created** (`src/services/paymentApi.ts`)
- Complete API client for payment operations
- Complete API client for saved payment methods
- Type-safe request/response interfaces
- Helper functions for data mapping between frontend and backend formats

✅ **PaymentContext Updated** (`src/contexts/PaymentContext.tsx`)
- Integrated with backend API
- Async operations with error handling
- Toast notifications for user feedback
- Auto-refresh after operations
- Loading states

✅ **Payments Page Updated** (`src/pages/Payments.tsx`)
- Async handlers for all operations
- Loading state display
- Error handling

## Backend API Endpoints

The frontend connects to: `http://localhost:8085/api`

### Payment Endpoints
- `POST /payments` - Create payment
- `GET /payments` - List payments (with filters)
- `GET /payments/{id}` - Get payment details
- `PUT /payments/{id}` - Update payment
- `PATCH /payments/{id}/status` - Update status
- `POST /payments/{id}/verify` - Verify payment
- `DELETE /payments/{id}` - Delete payment
- `GET /payments/summary` - Get statistics

### Saved Method Endpoints
- `POST /payment-methods` - Add method
- `GET /payment-methods` - List methods
- `PUT /payment-methods/{id}` - Update method
- `PATCH /payment-methods/{id}/status` - Set status
- `DELETE /payment-methods/{id}` - Delete method

## How to Run

### 1. Start the Backend

```bash
cd Backend/Payment-Management-Service

# Setup database (first time only)
cd database
setup_mysql.bat
cd ..

# Start the service
mvnw spring-boot:run
```

The backend will start on `http://localhost:8085`

### 2. Start the Frontend

```bash
cd frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is busy)

### 3. Test the Connection

1. Open your browser to `http://localhost:5173`
2. Navigate to the Payments page
3. You should see:
   - Loading spinner initially
   - Payment data from the backend
   - Saved payment methods from the backend

## Data Mapping

The frontend and backend use different formats for some fields:

### Payment Method
- Frontend: `card`, `cash`, `online_transfer`
- Backend: `CARD`, `CASH`, `ONLINE_TRANSFER`

### Payment Status
- Frontend: `pending`, `completed`, `failed`
- Backend: `PENDING`, `COMPLETED`, `FAILED`

These are automatically converted by the API service.

## Features

### Payment Management
- ✅ Create new payments
- ✅ View all payments with filters
- ✅ Update payment details
- ✅ Change payment status
- ✅ Delete payments
- ✅ Real-time statistics

### Saved Payment Methods
- ✅ Add new payment methods
- ✅ View all saved methods
- ✅ Update method details
- ✅ Delete methods
- ✅ Card number masking

### User Experience
- ✅ Loading states
- ✅ Success/error notifications
- ✅ Auto-refresh after operations
- ✅ Responsive design

## Troubleshooting

### Backend Not Starting
- Check if MySQL is running
- Verify database credentials in `application.properties`
- Check if port 8085 is available

### Frontend Can't Connect
- Verify backend is running on port 8085
- Check browser console for CORS errors
- Ensure API_BASE_URL in `paymentApi.ts` is correct

### CORS Issues
The backend has CORS enabled for all origins. If you still face issues:
1. Check `CorsConfig.java` in the backend
2. Verify the backend is running
3. Check browser console for specific errors

### Data Not Loading
1. Open browser DevTools (F12)
2. Go to Network tab
3. Check if API calls are being made
4. Look for error responses
5. Check backend logs for errors

## API Configuration

To change the backend URL, edit `frontend/src/services/paymentApi.ts`:

```typescript
const API_BASE_URL = 'http://localhost:8085/api';
```

For production, you might want to use environment variables:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8085/api';
```

Then create a `.env` file:
```
VITE_API_URL=https://your-production-api.com/api
```

## Testing the Integration

### 1. Create a Payment
1. Click "Record Payment" button
2. Fill in the form
3. Click "Record Payment"
4. Should see success toast
5. Payment appears in the table

### 2. Update a Payment
1. Click edit icon on a payment
2. Modify details
3. Click "Update Payment"
4. Should see success toast
5. Changes reflected in table

### 3. Change Status
1. Click the shield icon on a pending payment
2. Status changes to completed
3. Should see success toast

### 4. Delete a Payment
1. Click trash icon on a payment
2. Payment is removed
3. Should see success toast

### 5. Saved Methods
1. Click "Add Method" in Saved Payment Methods section
2. Fill in card details
3. Click "Add Method"
4. Card appears in the grid

## Next Steps

### Add Card Management Feature
Follow the `CARD_MANAGEMENT_GUIDE.md` in the backend to implement the full card management system with:
- User card management endpoints
- Admin card management endpoints
- Card security features
- Integration with frontend

### Add Authentication
Consider adding authentication to secure the admin panel:
1. Add JWT authentication to backend
2. Store token in frontend
3. Include token in API requests
4. Add login/logout functionality

### Add Pagination
For large datasets, implement pagination:
1. Backend already supports pagination
2. Add pagination controls to frontend
3. Update API calls to include page parameters

### Add Advanced Filters
Enhance filtering capabilities:
1. Date range picker
2. Amount range filter
3. Multiple status selection
4. Export to CSV/Excel

## Support

For issues or questions:
1. Check backend logs: `Backend/Payment-Management-Service/logs`
2. Check browser console for frontend errors
3. Review API documentation: `Backend/Payment-Management-Service/API_DOCUMENTATION.md`
4. Check database connection and data

## Summary

Your payment management system is now fully connected! The frontend admin panel communicates with the Spring Boot backend, providing a complete payment management solution with real-time updates and user-friendly notifications.
