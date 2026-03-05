# CORS Configuration Guide

## What is CORS?
CORS (Cross-Origin Resource Sharing) controls which websites can access your backend API. It's a security feature that prevents unauthorized websites from making requests to your server.

## Current Configuration

Your backend now has a centralized CORS configuration in:
`src/main/java/com/example/quotation_service/config/CorsConfig.java`

## Currently Allowed Origins

✅ **Development:**
- `http://localhost:5173` - Vite dev server
- `http://localhost:3000` - React dev server
- `http://localhost:4200` - Angular dev server
- `http://127.0.0.1:5173` - Alternative localhost

✅ **Production (Placeholder):**
- `https://your-app.netlify.app` - Replace with actual Netlify URL
- `https://your-app.vercel.app` - Replace with actual Vercel URL

## How to Add Your Frontend URL

### Step 1: Find Your Frontend URL

**If running locally:**
- Already configured! Use `http://localhost:5173`

**If deployed to Netlify:**
1. Deploy your frontend to Netlify
2. You'll get a URL like: `https://amazing-app-123abc.netlify.app`
3. Add this URL to the CORS config

**If deployed to Vercel:**
1. Deploy your frontend to Vercel
2. You'll get a URL like: `https://your-app.vercel.app`
3. Add this URL to the CORS config

**If using custom domain:**
- Add your domain like: `https://yourdomain.com`

### Step 2: Update CORS Configuration

Edit `src/main/java/com/example/quotation_service/config/CorsConfig.java`:

```java
config.setAllowedOrigins(Arrays.asList(
    "http://localhost:5173",
    "http://localhost:3000",
    "https://your-actual-netlify-url.netlify.app",  // ← Add your URL here
    "https://yourdomain.com"                         // ← Or your custom domain
));
```

### Step 3: Rebuild and Redeploy

After updating the CORS configuration:

```bash
# Rebuild the application
cd Backend/quotation-service
mvn clean package -DskipTests

# Rebuild Docker image
docker build -t quotation-service .

# Tag for ECR
docker tag quotation-service:latest 468284644046.dkr.ecr.us-east-1.amazonaws.com/quotation-service:latest

# Push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 468284644046.dkr.ecr.us-east-1.amazonaws.com
docker push 468284644046.dkr.ecr.us-east-1.amazonaws.com/quotation-service:latest

# Force ECS to use new image
aws ecs update-service --cluster quotation-cluster --service quotation-service --force-new-deployment --region us-east-1
```

## Testing CORS

### Test from Browser Console

Open your frontend in browser, then in console:

```javascript
fetch('http://18.204.16.14:8080/api/quotations/products')
  .then(res => res.json())
  .then(data => console.log('Success:', data))
  .catch(err => console.error('CORS Error:', err));
```

### Test with cURL

```bash
curl -H "Origin: http://localhost:5173" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://18.204.16.14:8080/api/quotations/products -v
```

Look for these headers in response:
- `Access-Control-Allow-Origin: http://localhost:5173`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH`

## Common CORS Errors

### Error: "No 'Access-Control-Allow-Origin' header"

**Cause:** Your frontend URL is not in the allowed origins list

**Solution:** Add your frontend URL to `CorsConfig.java` and redeploy

### Error: "CORS policy: credentials mode is 'include'"

**Cause:** Frontend is sending credentials but backend doesn't allow it

**Solution:** Already configured with `config.setAllowCredentials(true)`

### Error: "Method not allowed"

**Cause:** HTTP method (GET, POST, etc.) is not in allowed methods

**Solution:** Already configured with all common methods

## Security Best Practices

### ✅ DO:
- Specify exact frontend URLs in production
- Use HTTPS for production URLs
- Keep the list of allowed origins minimal
- Update CORS config when deploying to new domains

### ❌ DON'T:
- Use `@CrossOrigin("*")` in production (allows all origins)
- Allow `http://` origins in production (use HTTPS)
- Add untrusted domains to allowed origins

## Quick Reference

| Environment | Frontend URL | Status |
|-------------|--------------|--------|
| Local Dev | http://localhost:5173 | ✅ Configured |
| Netlify | https://your-app.netlify.app | ⚠️ Update needed |
| Vercel | https://your-app.vercel.app | ⚠️ Update needed |
| Custom Domain | https://yourdomain.com | ⚠️ Update needed |

## Need Help?

If you're still getting CORS errors:

1. Check browser console for exact error message
2. Verify your frontend URL is in the allowed origins list
3. Make sure you rebuilt and redeployed after changes
4. Check CloudWatch logs for backend errors:
   ```bash
   aws logs tail /ecs/quotation-service --follow --region us-east-1
   ```

---

**Current Backend:** http://18.204.16.14:8080
**Current Frontend:** http://localhost:5173 ✅
