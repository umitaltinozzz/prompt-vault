'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/Icons';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState<boolean | null>(null);
    const router = useRouter();

    // Check if registration is open
    useEffect(() => {
        fetch('/api/auth/register')
            .then((res) => res.json())
            .then((data) => setIsOpen(data.registrationOpen))
            .catch(() => setIsOpen(false));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Kayıt hatası');
            } else {
                // Redirect to login after successful registration
                router.push('/login?registered=true');
            }
        } catch {
            setError('Bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    };

    // Loading state
    if (isOpen === null) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="spinner" style={{ width: '40px', height: '40px' }} />
            </div>
        );
    }

    // Registration closed
    if (!isOpen) {
        return (
            <div
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                }}
            >
                <div
                    className="glass-card"
                    style={{
                        width: '100%',
                        maxWidth: '400px',
                        padding: '40px',
                        textAlign: 'center',
                    }}
                >
                    <div
                        style={{
                            width: '64px',
                            height: '64px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px',
                        }}
                    >
                        <span style={{ fontSize: '32px' }}>🔒</span>
                    </div>
                    <h1 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>
                        Kayıt Kapalı
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
                        Bu uygulama sadece bir kullanıcı destekliyor ve admin zaten kayıtlı.
                    </p>
                    <a href="/login" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
                        Giriş Yap
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
            }}
        >
            <div
                className="glass-card"
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    padding: '40px',
                }}
            >
                {/* Logo */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginBottom: '32px',
                    }}
                >
                    <div
                        style={{
                            width: '64px',
                            height: '64px',
                            background: 'linear-gradient(135deg, var(--color-accent), #6366f1)',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            marginBottom: '16px',
                        }}
                    >
                        <Icons.Vault />
                    </div>
                    <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
                        Prompt Vault
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                        Admin hesabı oluştur
                    </p>
                </div>

                {/* Info */}
                <div
                    style={{
                        background: 'rgba(139, 92, 246, 0.1)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        borderRadius: '8px',
                        padding: '12px',
                        marginBottom: '20px',
                        fontSize: '13px',
                        color: 'var(--color-text-secondary)',
                    }}
                >
                    ✨ İlk kayıt olan kişi admin olur. Kayıt sonrası yeni kullanıcı eklenemez.
                </div>

                {/* Error */}
                {error && (
                    <div
                        style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '8px',
                            padding: '12px',
                            marginBottom: '20px',
                            color: '#ef4444',
                            fontSize: '14px',
                            textAlign: 'center',
                        }}
                    >
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>
                            İsim
                        </label>
                        <input
                            type="text"
                            className="input-glass"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Admin"
                            disabled={isLoading}
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>
                            Email *
                        </label>
                        <input
                            type="email"
                            className="input-glass"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@example.com"
                            required
                            disabled={isLoading}
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>
                            Şifre * (min 8 karakter)
                        </label>
                        <input
                            type="password"
                            className="input-glass"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            minLength={8}
                            disabled={isLoading}
                            style={{ width: '100%' }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={isLoading}
                        style={{ width: '100%' }}
                    >
                        {isLoading ? (
                            <>
                                <div className="spinner" /> Oluşturuluyor...
                            </>
                        ) : (
                            'Admin Hesabı Oluştur'
                        )}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                    Zaten hesabın var mı?{' '}
                    <a href="/login" style={{ color: 'var(--color-accent)' }}>
                        Giriş Yap
                    </a>
                </p>
            </div>
        </div>
    );
}
