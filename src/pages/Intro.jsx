// src/pages/Home.tsx
import {Link, useNavigate} from 'react-router-dom';

const Intro = () => {
    const navigate = useNavigate();
    
    return (
        <iframe
        src="/external"
        width="100%"
        height="600px"
        title="Proxied Site"
        />
    );
};

export default Intro;
