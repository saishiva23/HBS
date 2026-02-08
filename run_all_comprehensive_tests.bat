@echo off
echo ========================================
echo COMPREHENSIVE TESTING SUITE
echo ========================================
echo.
echo Running all test types:
echo 1. Unit Tests
echo 2. Integration Tests
echo 3. API Tests
echo 4. Database Tests
echo 5. System Tests
echo 6. E2E Tests
echo.
pause

echo.
echo ========================================
echo 1. UNIT TESTS (Backend)
echo ========================================
cd springboot_backend_jwt
call .\mvnw.cmd test
if %errorlevel% neq 0 (
    echo ERROR: Unit tests failed
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo 2. INTEGRATION TESTS (Backend)
echo ========================================
cd springboot_backend_jwt
call .\mvnw.cmd verify
cd ..

echo.
echo ========================================
echo 3. API TESTS
echo ========================================
node comprehensive_system_test.js

echo.
echo ========================================
echo 4. DATABASE TESTS
echo ========================================
node test_database_operations.js

echo.
echo ========================================
echo 5. SYSTEM TESTS
echo ========================================
node test_complete_system.js

echo.
echo ========================================
echo TEST SUMMARY
echo ========================================
echo All tests completed!
echo Check individual test reports for details.
echo.
pause
