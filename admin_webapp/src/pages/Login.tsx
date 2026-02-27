import { useState } from 'react';
import { Card, Button, Input } from '@focusflow/ui';
import { Shield, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await authService.login(email, password);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-primary/10 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 premium-gradient rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40 mb-6">
                        <Shield className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-foreground tracking-tight">FocusFlow</h1>
                    <p className="text-muted-foreground mt-2">Sign in to manage your workplace</p>
                </div>

                <Card className="!p-8 relative overflow-hidden border-border/50 shadow-xl shadow-black/5">
                    <div className="absolute top-0 left-0 w-full h-1 premium-gradient" />

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm animate-shake">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                                <Input
                                    type="email"
                                    required
                                    placeholder="admin@focusflow.com"
                                    className="pl-10 py-6 bg-muted/30 border-border/50 text-foreground"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                                <Input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="pl-10 py-6 bg-muted/30 border-border/50 text-foreground"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <Button
                            disabled={loading}
                            className="w-full py-6 rounded-xl font-bold shadow-lg shadow-primary/25 group mt-4 text-white"
                            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' }} // Force gradient text color override
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
};

export default Login;
