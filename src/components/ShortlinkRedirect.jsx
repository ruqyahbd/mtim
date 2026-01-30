import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import shortlinks from '../data/shortlinks.json';

const ShortlinkRedirect = () => {
    const { slug } = useParams();
    const targetUrl = shortlinks[slug];

    useEffect(() => {
        if (targetUrl) {
            window.location.replace(targetUrl);
        }
    }, [targetUrl]);

    if (!targetUrl) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-4xl font-bold mb-4">Link Not Found</h1>
                <p className="text-gray-600 mb-8">The shortlink you are looking for does not exist or has been removed.</p>
                <a href="/" className="text-blue-600 hover:underline">Go back home</a>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-2xl font-semibold mb-4">Redirecting...</h1>
            <p className="text-gray-600">Please wait while we take you to your destination.</p>
        </div>
    );
};

export default ShortlinkRedirect;
