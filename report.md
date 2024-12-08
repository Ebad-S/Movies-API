# Movie API Project Report

## 1. Application Architecture & Technical Challenges

### Architecture Overview
The application follows a layered architecture pattern:
- **Routes Layer**: Handles HTTP requests and routes them to appropriate controllers
- **Controller Layer**: Contains business logic and database operations
- **Middleware Layer**: Handles cross-cutting concerns (authentication, logging, error handling)
- **Database Layer**: Manages data persistence using MySQL and Knex.js

### Technical Challenges Encountered

1. **Database Connection Issues**
   - Challenge: Initial connection issues with MySQL using the 'mysql' driver
   - Solution: Switched to 'mysql2' driver and implemented proper error handling

2. **SSL Certificate Implementation**
   - Challenge: Setting up HTTPS with self-signed certificates
   - Solution: Created a certificate generation script and proper SSL configuration

3. **Authentication Flow**
   - Challenge: Implementing secure JWT token validation
   - Solution: Created middleware for token verification and proper error handling

## 2. Technologies Used

### Core Technologies
- Node.js
- Express.js
- MySQL
- Knex.js (SQL Query Builder)

### Security
- HTTPS/SSL
- JWT (JSON Web Tokens)
- bcrypt (Password Hashing)

### Development Tools
- Postman (API Testing)
- nodemon (Development Server)
- MySQL Workbench

## 3. Application Robustness & Limitations

### Robustness Features
1. **Error Handling**
   - Comprehensive error catching and appropriate HTTP status codes
   - Detailed error messages in development, sanitized in production

2. **Input Validation**
   - Parameter validation for all endpoints
   - Query parameter restrictions where specified

3. **Database Reliability**
   - Connection pool management
   - Transaction support for data integrity

### API Limitations
1. **Search Functionality**
   - Limited to title-based search
   - No advanced filtering options

2. **Authentication**
   - Simple email/password authentication
   - No password reset functionality
   - No refresh token implementation

3. **Poster Management**
   - Limited file type support (PNG only)
   - No image processing capabilities
   - Basic storage system

## 4. Security Analysis

### HTTPS Implementation

#### Why is HTTPS important?
1. **Data Encryption**: Protects sensitive information during transmission
2. **Authentication**: Verifies server identity to clients
3. **Data Integrity**: Prevents man-in-the-middle attacks
4. **Trust**: Required for modern web standards and user trust

#### Certificate Authority vs Self-Signed Certificates
##### Why choose a Certificate Authority?
1. **Trust Chain**: Certificates are automatically trusted by browsers
2. **Professional Validation**: Verified organization identity
3. **Security Standards**: Regular security audits and updates
4. **Revocation Support**: Can revoke compromised certificates

#### Recommended Certificate Authority
**Let's Encrypt** would be the ideal choice because:
1. Free and automated certificate issuance
2. Wide industry support and recognition
3. Simple automation through certbot
4. 90-day certificate renewal promoting security

#### Certificate Installation Steps
1. **Initial Setup**
   ```bash
   sudo apt-get update
   sudo apt-get install certbot
   ```

2. **Certificate Obtainment**
   ```bash
   sudo certbot certonly --standalone -d yourdomain.com
   ```

3. **Auto-Renewal Setup**
   ```bash
   sudo certbot renew --dry-run
   ```

4. **Cron Job for Renewal**
   ```bash
   0 12 * * * /usr/bin/certbot renew --quiet
   ```

### Known Vulnerabilities
1. **Rate Limiting**: Currently no protection against brute force attacks
2. **File Upload**: Limited validation of uploaded files
3. **Token Management**: No token revocation system

## 5. Installation Guide

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- Git

### Installation Steps

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd movie-api
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Edit .env file with your configurations:
   ```
   PORT=3001
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=movies
   JWT_SECRET=your_secret
   ```

4. **Database Setup**
   ```bash
   mysql -u root -p
   source database/schema.sql
   ```

5. **Generate SSL Certificates**
   ```bash
   npm run generate-ssl
   ```

6. **Start the Server**
   Development mode:
   ```bash
   npm run dev
   ```
   Production mode:
   ```bash
   npm start
   ```

### Testing
Use Postman to test endpoints:
1. Import provided Postman collection
2. Set up environment variables
3. Disable SSL verification for development
4. Test endpoints according to documentation

### Troubleshooting
- Check MySQL service is running
- Verify correct database credentials
- Ensure SSL certificates are generated
- Check server logs in /logs directory
