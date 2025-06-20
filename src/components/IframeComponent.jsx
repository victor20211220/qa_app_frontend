import { useRef, useState, useEffect } from 'react';

const IframeComponent = ({ url }) => {
    const iframeRef = useRef(null);
    const [height, setHeight] = useState('auto');
    const proxyUrl = `${import.meta.env.VITE_API_URL}/proxy?url=${encodeURIComponent(url)}`;

    const handleIframeLoad = () => {
        try {
            const iframe = iframeRef.current;
            const doc = iframe.contentDocument || iframe.contentWindow.document;
            const contentHeight = doc.body.scrollHeight;
            setHeight(contentHeight + 'px');
        } catch (err) {
            console.error('Unable to access iframe content:', err);
        }
    };

    // Adjust iframe height on initial render and after loading
    useEffect(() => {
        const iframe = iframeRef.current;
        if (iframe) {
            iframe.onload = handleIframeLoad;
        }
    }, []);

    return (
        <iframe
            ref={iframeRef}
            src={proxyUrl} // Ensure proxyUrl is same-origin
            style={{ width: '100%', border: 'none', height }}
            title="How It Works"
            scrolling="no" // Ensure no scrolling
        />
    );
};

export default IframeComponent;
