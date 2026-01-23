// Test script to verify backend connection
// Run this in browser console on the login page

async function testBackendConnection() {
  const API_URL = 'http://127.0.0.1:7860';
  
  console.log('Testing backend connection...');
  
  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_URL}/health`);
    console.log('Health check status:', healthResponse.status);
    console.log('Health check response:', await healthResponse.json());
    
    // Test root endpoint
    console.log('2. Testing root endpoint...');
    const rootResponse = await fetch(`${API_URL}/`);
    console.log('Root status:', rootResponse.status);
    console.log('Root response:', await rootResponse.json());
    
    // Test login endpoint with OPTIONS (CORS preflight)
    console.log('3. Testing CORS preflight...');
    const corsResponse = await fetch(`${API_URL}/api/auth/login`, {
      method: 'OPTIONS',
      headers: {
        'Origin': window.location.origin,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type',
      }
    });
    console.log('CORS preflight status:', corsResponse.status);
    
    console.log('✅ Backend connection test completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Backend connection test failed:', error);
    return false;
  }
}

// Auto-run the test
testBackendConnection();