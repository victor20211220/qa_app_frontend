import { useRef, useState } from 'react';

const HowItWorks = () => {
  const iframeRef = useRef(null);
  const [height, setHeight] = useState('1000px'); // initial guess

  const handleIframeLoad = () => {
    try {
      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
      const contentHeight = doc.body.scrollHeight;
      setHeight(contentHeight + 'px');
    } catch (err) {
      console.error('Unable to access iframe content:', err);
    }
  };

  return (
    <iframe
      ref={iframeRef}
      src="https://youmentor.me/how-it-works-1" // must be same-origin!
      style={{ width: '100%', border: 'none', height }}
      onLoad={handleIframeLoad}
      title="How It Works"
    />
  );
};

export default HowItWorks;
