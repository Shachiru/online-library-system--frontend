export interface UserData {
    _id?: string;
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    lastLoginAt?: string;
}