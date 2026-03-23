import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Link, useNavigate } from 'react-router';
import { cn } from '../lib/utils';

export function Login() {
  const [role, setRole] = useState<'donor' | 'admin'>('donor');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background items-center justify-center p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-serif font-bold text-primary">Ashram Connect</h1>
        <p className="text-muted-foreground text-sm">Connecting Hearts to Hope</p>
      </div>

      <div className="w-full max-w-sm bg-card p-6 rounded-2xl shadow-lg border border-border">
        <div className="flex space-x-2 mb-6 bg-muted p-1 rounded-lg">
          <button
            onClick={() => setRole('donor')}
            className={cn(
              "flex-1 py-2 text-sm font-medium rounded-md transition-colors",
              role === 'donor' ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:bg-white/50"
            )}
          >
            Donor
          </button>
          <button
            onClick={() => setRole('admin')}
            className={cn(
              "flex-1 py-2 text-sm font-medium rounded-md transition-colors",
              role === 'admin' ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:bg-white/50"
            )}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input type="email" placeholder="you@example.com" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input type="password" placeholder="••••••••" required />
          </div>
          <div className="flex justify-between items-center text-xs">
            <Link to="#" className="text-primary hover:underline">Forgot password?</Link>
          </div>
          <Button type="submit" className="w-full text-lg h-12">
            Sign In
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full">Google</Button>
            <Button variant="outline" className="w-full">Facebook</Button>
          </div>
        </div>
      </div>
    </div>
  );
}