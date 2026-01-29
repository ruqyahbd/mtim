import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ChevronRight } from 'lucide-react';
import posts from '../data/posts.json';

const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
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
                        pointerEvents: 'none'
                    }}>
                        <Search color="var(--text-muted)" size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search articles..."
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 3rem',
                            fontSize: '1rem',
                            borderRadius: '0.5rem',
                            border: '1px solid var(--border)',
                            outline: 'none',
                            backgroundColor: 'var(--card-bg)'
                        }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
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
