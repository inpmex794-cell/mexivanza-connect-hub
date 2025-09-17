import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export function LoginPage() {
  const { user, login, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('mexivanza@mexivanza.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (user && !authLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: loginError } = await login(email, password);
      if (loginError) {
        setError(loginError.message || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold text-primary mb-2">
            Mexivanza
          </h1>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Admin Dashboard
          </h2>
          <p className="text-muted-foreground">
            Sign in to manage your travel platform
          </p>
        </div>

        <div className="bg-card p-8 rounded-lg border border-border shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Signing in...</span>
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted rounded-md">
            <p className="text-xs text-muted-foreground mb-2">Admin access required:</p>
            <p className="text-xs font-mono">mexivanza@mexivanza.com</p>
            <p className="text-xs text-muted-foreground">Contact admin for password</p>
          </div>
        </div>
      </div>
    </div>
  );
}