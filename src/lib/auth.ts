import { writable } from 'svelte/store';

export const token = writable<string | null>(null);
export const user = writable<any | null>(null);

const API_URL = 'https://aetheronepysocial.emolio.nl';

export async function login(email: string, password: string) {
    try {
        const response = await fetch(`${API_URL}/api/auth/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                username: email,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            // Handle specific error messages from server
            if (data.detail) {
                throw new Error(data.detail);
            }
            // Handle validation errors
            if (data.validation_error) {
                throw new Error(data.validation_error.join(', '));
            }
            // Generic error
            throw new Error('Login failed. Please check your credentials.');
        }

        token.set(data.access_token);
        user.set(data.user);
        return data;
    } catch (error) {
        // Network or parsing errors
        if (error instanceof Error) {
            throw new Error(`Login error: ${error.message}`);
        }
        throw new Error('An unexpected error occurred during login');
    }
}

export async function register(username: string, email: string, password: string) {
    try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            // Handle specific error messages from server
            if (data.detail) {
                throw new Error(data.detail);
            }
            // Handle validation errors
            if (data.validation_error) {
                throw new Error(data.validation_error.join(', '));
            }
            // Generic error
            throw new Error('Registration failed. Please try again.');
        }

        return data;
    } catch (error) {
        // Network or parsing errors
        if (error instanceof Error) {
            throw new Error(`Registration error: ${error.message}`);
        }
        throw new Error('An unexpected error occurred during registration');
    }
}

export async function getKeys(authToken: string) {
    const response = await fetch(`${API_URL}/api/session-keys/my-session-keys`, {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch keys');
    }

    return await response.json();
}

export async function getKeyDetails(authToken: string, keyId: string) {
    const response = await fetch(`${API_URL}/api/session-keys/my-session-keys/${keyId}`, {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch key details');
    }

    return await response.json();
}