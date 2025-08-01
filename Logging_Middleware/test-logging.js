// test-logging.js - Test the logging middleware

const { Logger, Log } = require('./logging');

// Your access token from the OAuth response
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhbmphaWFoZ2lkZGFsYUBnbWFpbC5jb20iLCJleHAiOjE3NTQwMjk0MzAsImlhdCI6MTc1NDAyODUzMCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImI5MTBiZTdjLTY0MGMtNDNlZi05MTIwLWFlYmY0YWRjY2YzMCIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImdpZGRhbGEgYW5qYWlhaCIsInN1YiI6IjNkYmQ3OTNjLWE0OWQtNGY3MS1iZTEyLWM2MzFkNDQ4NzY5NSJ9LCJlbWFpbCI6ImFuamFpYWhnaWRkYWxhQGdtYWlsLmNvbSIsIm5hbWUiOiJnaWRkYWxhIGFuamFpYWgiLCJyb2xsTm8iOiIyMmJxMWEwNTY5IiwiYWNjZXNzQ29kZSI6IlBuVkJGViIsImNsaWVudElEIjoiM2RiZDc5M2MtYTQ5ZC00ZjcxLWJlMTItYzYzMWQ0NDg3Njk1IiwiY2xpZW50U2VjcmV0IjoiRG5reERycVFiSHhKcnl3VCJ9.kEz723V7DuELe46bRHpptzLEV-ASs1mCSHC741NBZQw";

async function testLogging() {
    console.log('🚀 Testing Logging Middleware...\n');

    // Test 1: Using the convenience function
    console.log('📝 Test 1: Using Log() function');
    try {
        const result1 = await Log("backend", "info", "service", "User service initialized successfully", ACCESS_TOKEN);
        if (result1) {
            console.log('✅ Log created with ID:', result1.logID);
        } else {
            console.log('❌ Failed to create log');
        }
    } catch (error) {
        console.log('❌ Error:', error.message);
    }

    // Test 2: Using Logger class
    console.log('\n📝 Test 2: Using Logger class');
    try {
        const logger = new Logger(ACCESS_TOKEN);
        
        const result2 = await logger.log({
            stack: 'backend',
            level: 'debug',
            package: 'middleware',
            message: 'Request received for /api/users'
        });
        
        if (result2) {
            console.log('✅ Log created with ID:', result2.logID);
        } else {
            console.log('❌ Failed to create log');
        }
    } catch (error) {
        console.log('❌ Error:', error.message);
    }

    // Test 3: Error logging
    console.log('\n📝 Test 3: Error logging');
    try {
        const result3 = await Log("backend", "error", "handler", "received string, expected bool", ACCESS_TOKEN);
        if (result3) {
            console.log('✅ Error log created with ID:', result3.logID);
        } else {
            console.log('❌ Failed to create error log');
        }
    } catch (error) {
        console.log('❌ Error:', error.message);
    }

    // Test 4: Fatal logging
    console.log('\n📝 Test 4: Fatal logging');
    try {
        const result4 = await Log("backend", "fatal", "db", "Critical database connection failure", ACCESS_TOKEN);
        if (result4) {
            console.log('✅ Fatal log created with ID:', result4.logID);
        } else {
            console.log('❌ Failed to create fatal log');
        }
    } catch (error) {
        console.log('❌ Error:', error.message);
    }

    // Test 5: Frontend logging
    console.log('\n📝 Test 5: Frontend logging');
    try {
        const result5 = await Log("frontend", "warn", "api", "API request took longer than expected", ACCESS_TOKEN);
        if (result5) {
            console.log('✅ Frontend log created with ID:', result5.logID);
        } else {
            console.log('❌ Failed to create frontend log');
        }
    } catch (error) {
        console.log('❌ Error:', error.message);
    }

    console.log('\n🎉 Logging tests completed!');
}

// Run the tests
testLogging().catch(console.error); 