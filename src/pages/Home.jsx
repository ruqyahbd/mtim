import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { marked } from 'marked';
import posts from '../data/posts.json';

const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [oldHomeContent, setOldHomeContent] = useState('');
    const [isOldHomeExpanded, setIsOldHomeExpanded] = useState(false);

    useEffect(() => {
        const fetchOldHome = async () => {
            try {
                const response = await fetch('/Home.md?t=' + Date.now());
                if (!response.ok) throw new Error('Failed to fetch');
                let text = await response.text();
                // Remove metadata blocks [key: val]:/
                text = text.replace(/^\[.*\](?::\/)?\s*$/gm, '').trim();
                setOldHomeContent(marked(text));
            } catch (err) {
                console.error("Error loading old home content:", err);
            }
        };
        fetchOldHome();
    }, []);

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {oldHomeContent && (
                <div style={{
                    marginBottom: '2rem',
                    border: '1px solid var(--border)',
                    borderRadius: '0.75rem',
                    overflow: 'hidden',
                    backgroundColor: 'var(--card-bg)'
                }}>
                    <button
                        onClick={() => setIsOldHomeExpanded(!isOldHomeExpanded)}
                        style={{
                            width: '100%',
                            padding: '1rem 1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text)',
                            fontWeight: '600',
                            fontSize: '1rem',
                            textAlign: 'left'
                        }}
                    >
                        <span>Introduction & Popular Resources</span>
                        {isOldHomeExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    <AnimatePresence>
                        {isOldHomeExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                style={{ overflow: 'hidden' }}
                            >
                                <div
                                    className="markdown"
                                    style={{
                                        padding: '0 1.5rem 1.5rem 1.5rem',
                                        fontSize: '0.95rem',
                                        lineHeight: '1.6',
                                        borderTop: '1px solid var(--border)',
                                        marginTop: '0'
                                    }}
                                    dangerouslySetInnerHTML={{ __html: oldHomeContent }}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            <section style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.75rem' }}>Article Archive</h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    Recovered notes and lectures from Ustadh Muhammad Tim Humble.
                </p>

                <div style={{ position: 'relative', width: '100%' }}>
                    <div style={{
                        position: 'absolute',
                        left: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                        zIndex: 10
                    }}>
                        <Search color="var(--text-muted)" size={18} />
                    </div>
                    <input
                        autoFocus
                        type="text"
                        placeholder="Search articles..."
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 3rem',
                            fontSize: '1rem',
                            borderRadius: '0.5rem',
                            border: '2px solid #eab308', // yellow-500
                            outline: 'none',
                            backgroundColor: 'var(--card-bg)',
                            boxShadow: '0 0 0 4px rgba(234, 179, 8, 0.1)',
                            transition: 'all 0.2s ease-in-out'
                        }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={(e) => e.target.style.boxShadow = '0 0 0 4px rgba(234, 179, 8, 0.25)'}
                        onBlur={(e) => e.target.style.boxShadow = '0 0 0 4px rgba(234, 179, 8, 0.1)'}
                    />
                </div>
            </section>

            <div className="grid">
                {filteredPosts.map((post) => (
                    <motion.div key={post.id}>
                        <Link to={`/post/${post.id}`} className="card" style={{ display: 'block', height: '100%' }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                                {new Date(post.date).toLocaleDateString()}
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem', lineHeight: '1.4' }}>{post.title}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {post.excerpt}
                            </p>
                            <div style={{ color: 'var(--primary)', fontSize: '0.875rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                Read Article <ChevronRight size={14} />
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {filteredPosts.length === 0 && (
                <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
                    No articles found matching your search.
                </div>
            )}
        </motion.div>
    );
};

export default Home;
