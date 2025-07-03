// Authentication Utility Functions
class AuthManager {
    constructor() {
        this.API_BASE = 'https://seekr-analytics.squadhead.workers.dev/api';
        this.API_KEY_COOKIE = 'QUxMIFlPVVIgQkFTRSBBUkUgQkVMT05HIFRPIFVT';
        this.SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    }

    // Check if user is authenticated
    isAuthenticated() {
        const authToken = localStorage.getItem('authToken');
        const sessionExpiry = localStorage.getItem('sessionExpiry');
        
        if (!authToken || !sessionExpiry) {
            return false;
        }

        // Check if session has expired
        if (new Date(sessionExpiry) <= new Date()) {
            this.clearSession();
            return false;
        }

        return true;
    }

    // Get current user data
    getCurrentUser() {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    }

    // Get auth token
    getAuthToken() {
        return localStorage.getItem('authToken');
    }

    // Store session data
    storeSession(token, user) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(user));
        localStorage.setItem('sessionExpiry', new Date(Date.now() + this.SESSION_DURATION).toISOString());
        
        // Set API key cookie
        document.cookie = `apiKeyCookie=${this.API_KEY_COOKIE}; path=/; max-age=${this.SESSION_DURATION / 1000}; secure; samesite=strict`;
    }

    // Clear session data
    clearSession() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('sessionExpiry');
        
        // Clear API key cookie
        document.cookie = 'apiKeyCookie=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }

    // Validate session with server
    async validateSession() {
        try {
            const response = await fetch(`${this.API_BASE}/auth/get-session`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Session validation failed');
            }

            const data = await response.json();
            
            // Update session with fresh data
            if (data.session && data.user) {
                this.storeSession(data.session.token, data.user);
                return true;
            }

            return false;
        } catch (error) {
            console.error('Session validation error:', error);
            this.clearSession();
            return false;
        }
    }

    // Login function
    async login(email, password, rememberMe = false) {
        try {
            const response = await fetch(`${this.API_BASE}/auth/sign-in/email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    email,
                    password,
                    callbackURL: '',
                    rememberMe
                })
            });

            const text = await response.text();
            let data = {};
            
            try {
                data = text ? JSON.parse(text) : {};
            } catch (err) {
                data = {};
            }

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            if (data.token && data.user) {
                this.storeSession(data.token, data.user);
                return { success: true, data };
            }

            throw new Error('Invalid response from server');
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Signup function
    async signup(name, email, password) {
        try {
            const response = await fetch(`${this.API_BASE}/auth/sign-up/email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });

            const text = await response.text();
            let data = {};
            
            try {
                data = text ? JSON.parse(text) : {};
            } catch (err) {
                data = {};
            }

            if (!response.ok) {
                throw new Error(data.message || 'Signup failed');
            }

            if (data.token && data.user) {
                this.storeSession(data.token, data.user);
                return { success: true, data };
            }

            throw new Error('Invalid response from server');
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Logout function
    async logout() {
        try {
            await fetch(`${this.API_BASE}/auth/sign-out`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                credentials: 'include',
                body: '{}'
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.clearSession();
        }
    }

    // Redirect to login if not authenticated
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    // Redirect to dashboard if already authenticated
    redirectIfAuthenticated() {
        if (this.isAuthenticated()) {
            window.location.href = 'index.html';
            return true;
        }
        return false;
    }

    // Password validation
    validatePassword(password) {
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        return {
            isValid: Object.values(checks).every(check => check),
            checks
        };
    }

    // Email validation
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Get authorization headers for API requests
    getAuthHeaders() {
        const token = this.getAuthToken();
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    }
}

// Create global auth instance
const auth = new AuthManager();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
} 