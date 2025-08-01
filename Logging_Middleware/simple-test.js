// simple-test.js - Simple test for logging middleware

const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhbmphaWFoZ2lkZGFsYUBnbWFpbC5jb20iLCJleHAiOjE3NTQwMjk0MzAsImlhdCI6MTc1NDAyODUzMCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImI5MTBiZTdjLTY0MGMtNDNlZi05MTIwLWFlYmY0YWRjY2YzMCIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImdpZGRhbGEgYW5qYWlhaCIsInN1YiI6IjNkYmQ3OTNjLWE0OWQtNGY3MS1iZTEyLWM2MzFkNDQ4NzY5NSJ9LCJlbWFpbCI6ImFuamFpYWhnaWRkYWxhQGdtYWlsLmNvbSIsIm5hbWUiOiJnaWRkYWxhIGFuamFpYWgiLCJyb2xsTm8iOiIyMmJxMWEwNTY5IiwiYWNjZXNzQ29kZSI6IlBuVkJGViIsImNsaWVudElEIjoiM2RiZDc5M2MtYTQ5ZC00ZjcxLWJlMTItYzYzMWQ0NDg3Njk1IiwiY2xpZW50U2VjcmV0IjoiRG5reERycVFiSHhKcnl3VCJ9.kEz723V7DuELe46bRHpptzLEV-ASs1mCSHC741NBZQw";

const LOG_API_URL = 'http://20.244.56.144/evaluation-service/logs';

async function testLogging() {
    console.log('🚀 Testing Logging API with your access token...\n');

    const testCases = [
        {
            name: 'Backend Info Log',
            data: {
                stack: 'backend',
                level: 'info',
                package: 'service',
                message: 'User service initialized successfully'
            }
        },
        {
            name: 'Backend Error Log',
            data: {
                stack: 'backend',
                level: 'error',
                package: 'handler',
                message: 'received string, expected bool'
            }
        },
        {
            name: 'Backend Fatal Log',
            data: {
                stack: 'backend',
                level: 'fatal',
                package: 'db',
                message: 'Critical database connection failure'
            }
        },
        {
            name: 'Frontend Warning Log',
            data: {
                stack: 'frontend',
                level: 'warn',
                package: 'api',
                message: 'API request took longer than expected'
            }
        }
    ];

    for (const testCase of testCases) {
        console.log(`📝 Testing: ${testCase.name}`);
        try {
            const response = await fetch(LOG_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ACCESS_TOKEN}`
                },
                body: JSON.stringify(testCase.data)
            });

            if (response.ok) {
                const result = await response.json();
                console.log(`✅ Success! Log ID: ${result.logID}`);
            } else {
                console.log(`❌ Failed with status: ${response.status}`);
                const errorText = await response.text();
                console.log(`Error: ${errorText}`);
            }
        } catch (error) {
            console.log(`❌ Error: ${error.message}`);
        }
        console.log('');
    }

    console.log('🎉 Logging tests completed!');
}

// Run the tests
testLogging().catch(console.error); 