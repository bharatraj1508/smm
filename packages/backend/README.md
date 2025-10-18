# Gmail Summarizer API

A Node.js application that provides REST API endpoints to interact with Gmail using the Google Gmail API.

## Project Structure

```
├── controllers/
│   └── gmailController.js    # HTTP request handlers
├── routes/
│   └── gmailRoutes.js       # API route definitions
├── services/
│   └── gmailService.js      # Gmail API business logic
├── index.js                 # Express server setup
├── package.json
└── README.md
```

## Setup

1. Install dependencies:

   ```bash
   yarn install
   ```

2. Set up Google OAuth credentials:
   - Download your `credentials.json` file from Google Cloud Console
   - Place it in the project root directory

3. Start the server:
   ```bash
   node index.js
   ```

The server will start on port 3002 (or the PORT environment variable if set).

## API Endpoints

### Base URL: `http://localhost:3002`

- **GET /** - API information and available endpoints
- **GET /api/gmail/health** - Health check endpoint
- **GET /api/gmail/labels** - List all Gmail labels
- **GET /api/gmail/labels/:labelId** - Get a specific label by ID

## Example Usage

### List all labels

```bash
curl http://localhost:3002/api/gmail/labels
```

### Get a specific label

```bash
curl http://localhost:3002/api/gmail/labels/LABEL_ID
```

### Health check

```bash
curl http://localhost:3002/api/gmail/health
```

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": [...],
  "message": "Operation completed successfully"
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error message",
  "message": "User-friendly message"
}
```
