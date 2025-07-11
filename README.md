# Invoice AI Processing Service

This project is a Node.js-based backend service designed to intelligently extract structured data from PDF invoices. It leverages the power of Tesseract for Optical Character Recognition (OCR) and a local Large Language Model (LLM) via Ollama to understand and answer questions about the invoice content.

## Features

- **PDF Invoice Processing**: Accepts PDF files and converts them to images for analysis.
- **Tesseract OCR Integration**: High-performance, local OCR processing to extract raw text from invoices.
- **LLM Integration**: Connects to a local Ollama instance to analyze extracted text and provide structured JSON answers to user prompts.
- **Modular Architecture**: Built with a clean, scalable structure separating concerns for routing, services, and middleware.
- **Robust Error Handling**: Centralized error handling for graceful failure management.
- **Secure and Local**: All processing, including OCR and LLM analysis, can be run entirely on your local machine, ensuring data privacy.

## Architecture

The service is built with a simple, service-oriented architecture:

1.  **PDF Upload**: A PDF file and a text prompt are sent to the API.
2.  **Image Conversion**: The `pdf-poppler` library converts the PDF pages into high-resolution PNG images.
3.  **OCR**: Tesseract OCR processes the images to extract all text.
4.  **LLM Analysis**: The extracted text and the user's prompt are sent to the Ollama LLM.
5.  **JSON Response**: The LLM returns a structured JSON object, which is then sent back to the client.

## Prerequisites

Before you begin, ensure you have the following installed on your system (these instructions are for Debian/Ubuntu-based Linux):

- **Node.js**: v18.x or higher
- **npm**: v8.x or higher
- **Tesseract OCR**: The OCR engine.
  ```bash
  sudo apt update && sudo apt install -y tesseract-ocr
  ```
- **Ollama**: For running the local LLM. Follow the installation instructions at [https://ollama.ai/](https://ollama.ai/). After installing, pull a model to use, for example:
  ```bash
  ollama pull llama3
  ```

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd ocr-llm-service
    ```

2.  **Install Node.js dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a file named `.env` inside the `/config` directory. Add the following variables:
    ```env
    # The port the service will run on
    PORT=3000

    # The full URL for your Ollama generate endpoint
    OLLAMA_API_URL=http://localhost:11434/api/generate
    ```

## Running the Service

Once the setup is complete, you can start the service:

```bash
npm start
```

You should see a confirmation message in the console:
`OCR & LLM service running on http://localhost:3000`

## API Usage

The service exposes a single endpoint for processing invoices.

### Endpoint: `POST /api/process`

This endpoint accepts a `multipart/form-data` request to process a PDF invoice.

**Parameters:**

- `invoice` (file): The PDF invoice file to be processed.
- `prompt` (string): The question or instruction for the LLM to perform on the extracted text.

**Example `curl` Request:**

```bash
curl -X POST http://localhost:3000/api/process \
  -F "invoice=@/path/to/your/invoice.pdf" \
  -F "prompt=What is the total amount due?"
```

**Example Response:**

The service will return a JSON object from the LLM based on the prompt.

```json
{
  "total_amount_due": "108.50"
}
``` 