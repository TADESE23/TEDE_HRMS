import { createContext, useContext, useState, type ReactNode } from "react";

export interface User {
    id: string;
    name: string;
    role: string;
    email: string;
    photoUrl?: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password?: string) => Promise<boolean>;
    logout: () => void;
    updateProfilePhoto: (url: string) => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    const login = async (email: string, password?: string) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: password || 'password123' }) // Default password for easier testing if input missing
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            localStorage.setItem('token', data.accessToken);
            localStorage.setItem('user', JSON.stringify({
                id: data.id,
                email: data.email,
                role: data.role,
                name: data.email.split('@')[0] // Simple name derivation
            }));

            setUser({
                id: data.id,
                email: data.email,
                role: data.role,
                name: data.email.split('@')[0]
            });
            return true;
        } catch (error) {
            console.error("Login Error:", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const updateProfilePhoto = (url: string) => {
        if (user) {
            setUser({ ...user, photoUrl: url });
        }
    };

    // Load user from storage on mount
    useState(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    });

    return (
        <AuthContext.Provider value={{ user, login, logout, updateProfilePhoto, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
