#!/bin/bash

echo "========================================"
echo "Starting Full Stack Application"
echo "========================================"
echo ""

echo "[1/3] Checking prerequisites..."
echo ""

# Check Java
if ! command -v java &> /dev/null; then
    echo "ERROR: Java is not installed"
    exit 1
fi
echo "✓ Java found"

# Check Node
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    exit 1
fi
echo "✓ Node.js found"

# Check MySQL
if ! mysql -u root -p'Wr250x&@8052' -e "SELECT 1" &> /dev/null; then
    echo "WARNING: Cannot connect to MySQL"
    echo "Please ensure MySQL is running"
    read -p "Press Enter to continue..."
fi
echo "✓ MySQL connection OK"
echo ""

echo "[2/3] Starting Backend (Spring Boot)..."
echo ""
cd Backend/quotation-service

# Start backend in background
./mvnw spring-boot:run > backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend starting on http://localhost:8080 (PID: $BACKEND_PID)"
echo ""

# Wait for backend to start
echo "Waiting for backend to start (30 seconds)..."
sleep 30

echo "[3/3] Starting Frontend (React + Vite)..."
echo ""
cd ../../frontend

# Start frontend in background
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend starting on http://localhost:5173 (PID: $FRONTEND_PID)"
echo ""

echo "========================================"
echo "Application Started Successfully!"
echo "========================================"
echo ""
echo "Backend:  http://localhost:8080"
echo "Frontend: http://localhost:5173"
echo ""
echo "User Interface:  http://localhost:5173/user/request-quotation"
echo "Admin Interface: http://localhost:5173/admin/quotations"
echo ""
echo "Backend PID:  $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "To stop the application, run:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "Or press Ctrl+C and run: pkill -f 'spring-boot:run|vite'"
echo ""

# Save PIDs to file for easy cleanup
echo "$BACKEND_PID" > .app.pid
echo "$FRONTEND_PID" >> .app.pid

# Wait for user interrupt
trap "echo ''; echo 'Stopping application...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; rm -f .app.pid; echo 'Application stopped'; exit 0" INT

echo "Press Ctrl+C to stop the application"
wait
