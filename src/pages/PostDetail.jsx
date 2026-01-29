import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { marked } from 'marked';
import { ArrowLeft, Clock, Share2 } from 'lucide-react';
import posts from '../data/posts.json';

const PostDetail = () => {
    const { id } = useParams();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const post = posts.find(p => p.id === id);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch(`/${id}.md`);
                if (!response.ok) throw new Error('Failed to fetch');
                let text = await response.text();

                // Remove metadata blocks if present at the top
                text = text.replace(/^\[.*\](?::\/)?\s*$/gm, '').trim();

                // Remove legacy nav blocks
                text = text.replace(/<div id="nav"[\s\S]*?<\/div>/g, '').trim();

                setContent(marked(text));
                setLoading(false);
            } catch (err) {
                console.error("Error loading post:", err);
                setContent('<p style="text-align:center; padding: 2rem;">Error loading article content. Please try again later.</p>');
                setLoading(false);
            }
        };

        fetchContent();
        window.scrollTo(0, 0);
    }, [id]);

    if (!post) return <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}><h2>Article not found</h2><Link to="/">Return Home</Link></div>;

    return (
        <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ maxWidth: '800px', margin: '0 auto' }}
        >
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
                <ArrowLeft size={16} /> Back to Archive
            </Link>

            <header style={{ marginBottom: '3rem', borderBottom: '1px solid var(--border)', paddingBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', lineHeight: '1.2' }}>{post.title}</h1>
                <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={14} /> {new Date(post.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <span
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            alert('Link copied to clipboard!');
                        }}
                    >
                        <Share2 size={14} /> Share
                    </span>
                </div>
            </header>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem' }}>Loading article...</div>
            ) : (
                <div
                    className="markdown"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            )}
        </motion.article>
    );
};

export default PostDetail;
