import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Layout from './components/Layout';
import ShortlinkRedirect from './components/ShortlinkRedirect';

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/post/:id" element={<PostDetail />} />
                    <Route path="/:slug" element={<ShortlinkRedirect />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
