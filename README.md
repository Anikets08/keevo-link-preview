# Keevo Link Preview API

A secure and efficient API service that fetches metadata from URLs, including Open Graph tags, Twitter Cards, and standard HTML metadata. Perfect for generating link previews in web applications.

## Features

- 🔒 Secure by default with multiple security measures
- 🚀 Fast metadata extraction
- 📱 Support for Open Graph and Twitter Card metadata
- ⚡ Rate limiting to prevent abuse
- 🌐 Configurable CORS support
- ✅ URL validation
- 🔄 Automatic redirect handling
- ⏱️ Request timeout protection

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/keevo-link-preview.git
cd keevo-link-preview
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables (optional):

```bash
cp .env.example .env
```

## Environment Variables

| Variable          | Description                                  | Default     |
| ----------------- | -------------------------------------------- | ----------- |
| `PORT`            | Port number for the server                   | 3000        |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed CORS origins | \*          |
| `NODE_ENV`        | Environment mode (development/production)    | development |

## Usage

### Starting the Server

```bash
npm start
```

The server will start on port 3000 by default (configurable via PORT environment variable).

### API Endpoint

#### GET /api/preview

Fetches metadata for a given URL.

**Query Parameters:**

| Parameter | Type   | Required | Description                                                          |
| --------- | ------ | -------- | -------------------------------------------------------------------- |
| `url`     | string | Yes      | The URL to fetch metadata from (must start with http:// or https://) |

**Example Request:**

```bash
curl "http://localhost:3000/api/preview?url=https://example.com"
```

**Success Response:**

```json
{
  "url": "https://example.com",
  "title": "Example Domain",
  "description": "This is an example website",
  "image": "https://example.com/image.jpg",
  "siteName": "Example",
  "type": "website"
}
```

**Error Response:**

```json
{
  "errors": [
    {
      "msg": "Invalid URL format. URL must start with http:// or https://",
      "param": "url",
      "location": "query"
    }
  ]
}
```

## Security Features

- **Helmet**: Secure HTTP headers
- **CORS**: Configurable origin restrictions
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **URL Validation**: Strict URL format checking
- **Request Timeouts**: 5-second timeout for external requests
- **Redirect Limits**: Maximum of 5 redirects
- **Custom User-Agent**: Identifiable request source

## Rate Limiting

The API implements rate limiting to prevent abuse:

- Window: 15 minutes
- Max requests per window: 100 per IP
- Custom error message when limit is exceeded

## Development

### Dependencies

- express: Web framework
- axios: HTTP client
- cheerio: HTML parsing
- express-rate-limit: Rate limiting
- express-validator: Input validation
- cors: CORS support
- helmet: Security headers

### Code Style

The project uses ESLint and Prettier for code formatting. To format code:

```bash
npm run format
```

## Production Deployment

For production deployment, consider:

1. Setting appropriate environment variables
2. Configuring specific CORS origins
3. Adjusting rate limits based on your needs
4. Setting up monitoring and logging
5. Using HTTPS
6. Implementing API key authentication if needed

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
