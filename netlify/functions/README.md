# Netlify Functions

This directory contains serverless functions that power the backend of Picognito.

## 🧩 Function Philosophy

Picognito uses Netlify Functions to implement serverless backend capabilities:

- **Privacy-First**: All functions prioritize user privacy and data minimization
- **Stateless**: Functions are designed to be stateless and scalable
- **Secure**: Implement proper authentication and authorization checks
- **Efficient**: Minimize execution time and resource usage

## 📋 Available Functions

### `photo-upload`
Handles secure, anonymous photo uploads.

#### Features:
- Metadata removal from uploaded images
- Content filtering using AI moderation
- Secure storage with Netlify blob store
- Generation of anonymous control URLs

#### Usage:
```js
// Client-side upload example
async function uploadPhoto(photoBlob, locationData) {
	const formData = new FormData();
	formData.append('photo', photoBlob);
	formData.append('location', JSON.stringify(locationData));

	const response = await fetch('/.netlify/functions/photo-upload', {
		method: 'POST',
		body: formData
	});

	return await response.json();
}
```

### `photo-discover`
Retrieves photos based on location parameters.

#### Features:
- Geospatial querying of photos
- Privacy-preserving location filtering
- Pagination and clustering support
- Content moderation integration

### `contact-form`
Processes contact form submissions.

#### Features:
- Email notification
- Spam filtering
- Rate limiting
- Form validation

## 🛠️ Creating New Functions

### Function Structure

Each function should be in its own file with a clear, descriptive name. Use the following template:

```js
/**
 * @function function-name
 * @description Brief description of function purpose
 */

/**
 * @typedef {Object} RequestData
 * @property {string} property - Description of property
 */

/**
 * @typedef {Object} ResponseData
 * @property {string} property - Description of property
 */

/**
 * Main handler function
 * @param {Object} event - Netlify function event
 * @param {Object} context - Netlify function context
 * @returns {Promise<Object>} Response object
 */
export async function handler(event, context) {
	// Log function invocation
	console.log('🔧 📥', 'Function invoked with method:', event.httpMethod);

	try {
		// Extract and validate data from event
		const data = JSON.parse(event.body);

		// Process data
		const result = await processData(data);

		// Return success response
		return {
			statusCode: 200,
			body: JSON.stringify({ success: true, data: result })
		};
	} catch (error) {
		// Log error
		console.error('🔧 🚨', 'Error processing request:', error);

		// Return error response
		return {
			statusCode: 500,
			body: JSON.stringify({
				success: false,
				message: 'An error occurred'
			})
		};
	}
}

/**
 * Process the incoming data
 * @param {RequestData} data - The data to process
 * @returns {Promise<ResponseData>} The processed data
 */
async function processData(data) {
	// Implementation
}
```

## 📊 Function Best Practices

- **Error Handling**: Use try/catch blocks and return appropriate status codes
- **Validation**: Always validate incoming data before processing
- **Logging**: Use consistent logging patterns with emojis as defined in style guide
- **Security**: Implement proper authentication and authorization
- **Performance**: Keep functions lightweight and fast-executing
- **Testing**: Write unit tests for each function

## 🔐 Security Considerations

- **Authentication**: Use proper authentication mechanisms
- **Input Validation**: Always validate and sanitize user input
- **Rate Limiting**: Implement rate limiting to prevent abuse
- **Environment Variables**: Store sensitive data in environment variables
- **CORS**: Configure appropriate CORS headers

See [ARCHITECTURE.md](../../ARCHITECTURE.md) for overall project structure and [STYLE_GUIDE.md](../../STYLE_GUIDE.md) for coding standards.