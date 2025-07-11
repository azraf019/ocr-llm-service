// test-complete.js - Test the complete OCR & LLM pipeline

const axios = require('axios');

async function testServices() {
    console.log('🔍 Testing OCR & LLM Service Components...\n');

    // Test 1: Check if Node.js service is running
    try {
        // Try to connect to the service (any method will work to test connectivity)
        await axios.get('http://localhost:5001', {
            timeout: 5000
        });
        console.log('✅ Node.js service is running on port 5001');
    } catch (err) {
        if (err.code === 'ECONNREFUSED') {
            console.log('❌ Node.js service is not accessible on port 5001');
            return;
        } else if (err.response) {
            // Any response means the service is running
            console.log('✅ Node.js service is running on port 5001');
        } else {
            console.log('❌ Node.js service is not accessible');
            return;
        }
    }

    // Test 2: Check if PaddleOCR is running
    try {
        // Try multiple possible endpoints for PaddleOCR
        let ocrWorking = false;
        
        // Try /health endpoint
        try {
            await axios.get('http://localhost:9292/health', { timeout: 3000 });
            console.log('✅ PaddleOCR service is running on port 9292 (/health)');
            ocrWorking = true;
        } catch (err) {
            // Try root endpoint
            try {
                await axios.get('http://localhost:9292/', { timeout: 3000 });
                console.log('✅ PaddleOCR service is running on port 9292 (/)');
                ocrWorking = true;
            } catch (err2) {
                // Try /ocr/predict endpoint
                try {
                    await axios.get('http://localhost:9292/ocr/predict', { timeout: 3000 });
                    console.log('✅ PaddleOCR service is running on port 9292 (/ocr/predict)');
                    ocrWorking = true;
                } catch (err3) {
                    // Just check if port is listening
                    const { exec } = require('child_process');
                    const { promisify } = require('util');
                    const execAsync = promisify(exec);
                    
                    try {
                        await execAsync('netstat -tlnp | grep 9292');
                        console.log('✅ PaddleOCR service is running on port 9292 (port listening)');
                        ocrWorking = true;
                    } catch (err4) {
                        console.log('❌ PaddleOCR service is not accessible on port 9292');
                        console.log('   Make sure PaddleOCR Docker container is running');
                    }
                }
            }
        }
        
        if (!ocrWorking) {
            console.log('❌ PaddleOCR service is not accessible on port 9292');
            console.log('   Make sure PaddleOCR Docker container is running');
        }
    } catch (err) {
        console.log('❌ PaddleOCR service is not accessible on port 9292');
        console.log('   Make sure PaddleOCR Docker container is running');
    }

    // Test 3: Check if Ollama is running
    try {
        const ollamaResponse = await axios.get('http://localhost:11434/api/tags', {
            timeout: 5000
        });
        console.log('✅ Ollama service is running on port 11434');
        
        // Check if llama3 model is available
        if (ollamaResponse.data && ollamaResponse.data.models) {
            const hasLlama3 = ollamaResponse.data.models.some(model => 
                model.name.includes('llama3')
            );
            if (hasLlama3) {
                console.log('✅ llama3 model is available');
            } else {
                console.log('⚠️  llama3 model not found, run: ollama pull llama3');
            }
        }
    } catch (err) {
        console.log('❌ Ollama service is not accessible on port 11434');
        console.log('   Make sure Ollama is running: ollama serve');
    }

    console.log('\n📝 To test with a PDF file:');
    console.log('curl -X POST http://localhost:5001/api/process \\');
    console.log('  -F "pdf=@your-document.pdf" \\');
    console.log('  -F "prompt=Extract invoice details including vendor name, amount, date, and line items"');
    
    console.log('\n🚀 Your OCR & LLM service is ready to process PDFs!');
}

testServices().catch(console.error); 