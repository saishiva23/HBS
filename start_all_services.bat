@echo off
echo ========================================
echo Starting Hotel Booking System
echo ========================================
echo.

echo [1/3] Starting MySQL Database...
echo Make sure MySQL is running on port 3306
echo.

echo [2/3] Starting Invoice Service (Port 5000)...
start "Invoice Service" cmd /k "cd HotelBookingInvoiceService\InvoiceService && dotnet run"
timeout /t 5 /nobreak >nul

echo [3/3] Starting Spring Boot Backend (Port 8080)...
start "Spring Boot Backend" cmd /k "cd springboot_backend_jwt && mvnw.cmd spring-boot:run"
timeout /t 10 /nobreak >nul

echo [4/4] Starting React Frontend (Port 5173)...
start "React Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo All services are starting!
echo ========================================
echo.
echo Services:
echo - Invoice Service:  http://localhost:5000
echo - Backend API:      http://localhost:8080
echo - Frontend:         http://localhost:5173
echo.
echo Press any key to exit (services will keep running)...
pause >nul
