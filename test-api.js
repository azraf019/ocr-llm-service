// test-api.js - Simple test script for the OCR & LLM service

const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

async function testAPI() {
    try {
        console.log('Testing OCR & LLM Service...');
        
        // Check if service is running
        const healthCheck = await axios.get('http://localhost:5001/api/process', {
            timeout: 5000
        }).catch(err => {
            if (err.response && err.response.status === 405) {
                console.log('✅ Service is running (Method Not Allowed is expected for GET)');
                return true;
            }
            throw err;
        });
        
        console.log('✅ Service is accessible');
        
        // Note: You'll need to provide a PDF file to test the full functionality
        console.log('\n📝 To test with a PDF file, run:');
        console.log('curl -X POST http://localhost:5001/api/process \\');
        console.log('  -F "pdf=@your-document.pdf" \\');
        console.log('  -F "prompt=Extract invoice details including vendor name, amount, date, and line items"');
        
    } catch (error) {
        console.error('❌ Error testing service:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.log('💡 Make sure the service is running on port 5001');
        }
    }
}

testAPI(); 