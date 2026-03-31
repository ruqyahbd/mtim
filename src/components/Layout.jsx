import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Github, Sun, Moon, Languages, Book, Menu, X } from 'lucide-react';

const GOOGLE_TRANSLATE_COOKIE = 'googtrans';

const getTranslateCookieValue = () => {
    const match = document.cookie
        .split('; ')
        .find((item) => item.startsWith(`${GOOGLE_TRANSLATE_COOKIE}=`));

    return match ? decodeURIComponent(match.split('=')[1]) : '';
};

const setTranslateCookie = (value) => {
    const encodedValue = encodeURIComponent(value);
    document.cookie = `${GOOGLE_TRANSLATE_COOKIE}=${encodedValue}; path=/; max-age=31536000; SameSite=Lax`;

    if (window.location.hostname && window.location.hostname !== 'localhost') {
        document.cookie = `${GOOGLE_TRANSLATE_COOKIE}=${encodedValue}; path=/; domain=.${window.location.hostname}; max-age=31536000; SameSite=Lax`;
    }
};

const clearTranslateCookie = () => {
    document.cookie = `${GOOGLE_TRANSLATE_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

    if (window.location.hostname && window.location.hostname !== 'localhost') {
        document.cookie = `${GOOGLE_TRANSLATE_COOKIE}=; path=/; domain=.${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
};

const Header = () => {
    const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark');
    const [isBengali, setIsBengali] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [translateReady, setTranslateReady] = useState(false);
    const [translateError, setTranslateError] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (isDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    useEffect(() => {
        setIsBengali(getTranslateCookieValue() === '/en/bn');
    }, []);

    // Google Translate Initialization
    useEffect(() => {
        window.googleTranslateElementInit = () => {
            if (window.google && window.google.translate) {
                new window.google.translate.TranslateElement({
                    pageLanguage: 'en',
                    includedLanguages: 'bn',
                    layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                    autoDisplay: false
                }, 'google_translate_element');
                setTranslateReady(true);
                setTranslateError(false);
            }
        };

        const existingScript = document.getElementById('google-translate-script');
        if (!existingScript) {
            const addScript = document.createElement('script');
            addScript.id = 'google-translate-script';
            addScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            addScript.async = true;
            addScript.onload = () => {
                if (window.google?.translate) {
                    setTranslateReady(true);
                }
            };
            addScript.onerror = () => {
                setTranslateError(true);
            };
            document.body.appendChild(addScript);
        } else if (window.google?.translate) {
            setTranslateReady(true);
        }

        return () => {
            delete window.googleTranslateElementInit;
        };
    }, []);

    const toggleTranslation = () => {
        if (translateError) {
            alert('Translation service could not be loaded. Check your network or browser blocking settings and try again.');
            return;
        }

        if (!translateReady) {
            alert('Translation engine is still loading. Please wait a few seconds and try again.');
            return;
        }

        if (isBengali) {
            clearTranslateCookie();
            setIsBengali(false);
        } else {
            setTranslateCookie('/en/bn');
            setIsBengali(true);
        }

        window.location.reload();
    };

    return (
        <header style={{
            margin: '0 0 3rem',
            padding: '1rem 0',
            borderBottom: '1px solid var(--border)',
            position: 'sticky',
            top: 0,
            backgroundColor: 'var(--bg)',
            zIndex: 1000
        }}>
            <div id="google_translate_element"></div>
            <nav className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to="/" style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '-0.02em' }}>
                        MTIM Archive
                    </Link>

                    {/* Desktop Menu */}
                    <div style={{ display: 'none', gap: '0.75rem', alignItems: 'center' }} className="desktop-menu">
                        <Link to="/" className="btn btn-icon" title="Home">
                            <Home size={18} />
                        </Link>

                        <Link to="/post/Notes-index" className="btn" style={{ gap: '0.4rem' }}>
                            <Book size={18} /> Notes
                        </Link>

                        <button onClick={toggleTranslation} className="btn" style={{ gap: '0.4rem', color: isBengali ? 'var(--primary)' : 'inherit' }}>
                            <Languages size={18} /> {isBengali ? 'English' : 'বাংলা'}
                        </button>

                        <button onClick={() => setIsDark(!isDark)} className="btn btn-icon" title="Toggle Theme">
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        <a href="https://github.com/ruqyahbd/mtim" target="_blank" rel="noreferrer" className="btn btn-icon" title="GitHub Project">
                            <Github size={18} />
                        </a>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div style={{ display: 'flex', gap: '0.5rem' }} className="mobile-only">
                        <button onClick={() => setIsDark(!isDark)} className="btn btn-icon">
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="btn btn-icon">
                            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Content */}
                {isMenuOpen && (
                    <div style={{
                        marginTop: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        padding: '1rem 0',
                        borderTop: '1px solid var(--border)'
                    }} className="mobile-only">
                        <Link to="/" className="btn" style={{ justifyContent: 'flex-start' }}>
                            <Home size={18} /> Home
                        </Link>
                        <Link to="/post/Notes-index" className="btn" style={{ justifyContent: 'flex-start' }}>
                            <Book size={18} /> Notes
                        </Link>
                        <button onClick={toggleTranslation} className="btn" style={{ justifyContent: 'flex-start', color: isBengali ? 'var(--primary)' : 'inherit' }}>
                            <Languages size={18} /> {isBengali ? 'English' : 'বাংলা'}
                        </button>
                        <a href="https://github.com/ruqyahbd/mtim" target="_blank" rel="noreferrer" className="btn" style={{ justifyContent: 'flex-start' }}>
                            <Github size={18} /> GitHub
                        </a>
                    </div>
                )}
            </nav>

            <style>{`
                @media (min-width: 768px) {
                    .desktop-menu { display: flex !important; }
                    .mobile-only { display: none !important; }
                }
                .btn-icon {
                    padding: 0.6rem !important;
                    width: auto !important;
                }
                #google_translate_element {
                    position: absolute;
                    left: -9999px;
                    top: 0;
                    opacity: 0;
                    pointer-events: none;
                }
            `}</style>
        </header>
    );
};

const Footer = () => (
    <footer className="container" style={{ marginTop: '5rem', padding: '3rem 0', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            © {new Date().getFullYear()} Muhammad Tim Humble Archive.
        </p>
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
            <a href="https://facebook.com/groups/ruqyahbd" target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '500' }}>
                Ruqyah Support BD
            </a>
        </div>
    </footer>
);

const Layout = ({ children }) => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <main className="container" style={{ flex: 1 }}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
