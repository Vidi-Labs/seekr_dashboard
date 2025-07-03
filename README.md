# Seekr Dashboard

A comprehensive analytics dashboard for the Seekr application with robust authentication system.

## Features

### Authentication System
- **Secure Login/Signup**: Modern authentication with email and password
- **Session Management**: Automatic session validation and renewal
- **Password Security**: Strong password requirements with real-time validation
- **Remember Me**: Optional persistent login sessions
- **Auto-redirect**: Smart navigation based on authentication status

### Dashboard Features
- **Real-time Analytics**: Live data updates every 5 seconds
- **User Statistics**: Total users, active users, API requests
- **Feature Analytics**: Text detection, scene detection, depth detection, supermarket usage
- **Geographic Data**: Location logs by country with interactive charts
- **Time-based Filtering**: Last week, last month, or custom date ranges
- **Responsive Design**: Works on desktop and mobile devices

## Authentication API Endpoints

### Sign Up
```bash
POST https://seekr-analytics.squadhead.workers.dev/api/auth/sign-up/email
Content-Type: application/json

{
  "name": "User Name",
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "token": "auth_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "emailVerified": false,
    "createdAt": "2025-07-03T05:29:25.432Z",
    "updatedAt": "2025-07-03T05:29:25.432Z"
  }
}
```

### Sign In
```bash
POST https://seekr-analytics.squadhead.workers.dev/api/auth/sign-in/email
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "callbackURL": "",
  "rememberMe": true
}
```

**Response:**
```json
{
  "redirect": false,
  "token": "auth_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "emailVerified": false,
    "createdAt": "2025-07-03T05:29:25.432Z",
    "updatedAt": "2025-07-03T05:29:25.432Z"
  }
}
```

### Get Session
```bash
GET https://seekr-analytics.squadhead.workers.dev/api/auth/get-session
Authorization: Bearer auth_token_here
```

**Response:**
```json
{
  "session": {
    "expiresAt": "2025-07-10T05:32:20.707Z",
    "token": "auth_token_here",
    "createdAt": "2025-07-03T05:32:20.707Z",
    "updatedAt": "2025-07-03T05:32:20.707Z",
    "userId": "user_id",
    "id": "session_id"
  },
  "user": {
    "name": "User Name",
    "email": "user@example.com",
    "emailVerified": false,
    "createdAt": "2025-07-03T05:29:25.432Z",
    "updatedAt": "2025-07-03T05:29:25.432Z",
    "id": "user_id"
  }
}
```

### Sign Out
```bash
POST https://seekr-analytics.squadhead.workers.dev/api/auth/sign-out
Authorization: Bearer auth_token_here
Content-Type: application/json

{}
```

## Password Requirements

Passwords must meet the following criteria:
- At least 8 characters long
- Contains at least one uppercase letter (A-Z)
- Contains at least one lowercase letter (a-z)
- Contains at least one number (0-9)
- Contains at least one special character (!@#$%^&*(),.?":{}|<>)

## File Structure

```
seekr_dashboard/
├── index.html              # Main dashboard
├── login.html              # Login page
├── signup.html             # Signup page
├── auth.js                 # Authentication utility
├── style.css               # Global styles
├── users_logs.html         # User logs page
├── active_users.html       # Active users page
├── location_logs.html      # Location logs page
├── event_logs.html         # Event logs page
├── api_logs.html           # API logs page
├── user-details.html       # User details page
├── event_log_details.html  # Event log details page
└── code_dump.html          # Code dump page
```

## Authentication Flow

1. **Initial Access**: Users are redirected to login page if not authenticated
2. **Login/Signup**: Users can either sign in or create a new account
3. **Session Storage**: Authentication tokens and user data are stored securely
4. **Session Validation**: Regular validation with the server to ensure session integrity
5. **Auto-logout**: Automatic logout when session expires or becomes invalid
6. **Secure Logout**: Proper cleanup of all session data on logout

## Security Features

- **Token-based Authentication**: Secure JWT-like tokens for API access
- **Session Expiry**: Automatic session expiration after 7 days
- **Secure Cookies**: HTTP-only cookies with proper security flags
- **Input Validation**: Client-side and server-side validation
- **Password Hashing**: Passwords are hashed on the server side
- **CSRF Protection**: Built-in protection against cross-site request forgery

## Usage

1. **Access the Dashboard**: Navigate to `index.html`
2. **Authentication**: You'll be redirected to login if not authenticated
3. **Create Account**: Use the signup page to create a new account
4. **Dashboard Navigation**: Use the sidebar to navigate between different sections
5. **Data Filtering**: Use the time range selector to filter data
6. **Logout**: Click the logout button to securely sign out

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Development

The authentication system is built with vanilla JavaScript and uses:
- **localStorage**: For client-side session storage
- **Cookies**: For API key storage
- **Fetch API**: For HTTP requests
- **ES6+ Features**: Modern JavaScript features for better code organization

## API Integration

The dashboard integrates with the Seekr Analytics API for:
- User authentication and session management
- Real-time analytics data
- User activity tracking
- Geographic data analysis
- Feature usage statistics

## Error Handling

The system includes comprehensive error handling for:
- Network connectivity issues
- Invalid credentials
- Session expiration
- Server errors
- Validation errors

## Performance

- **Lazy Loading**: Data is loaded on-demand
- **Polling**: Real-time updates every 5 seconds
- **Caching**: Efficient data caching and storage
- **Optimized Requests**: Minimal API calls with proper error handling 