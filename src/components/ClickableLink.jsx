import React from 'react';
import { useNavigate } from 'react-router-dom';

const ClickableLink = ({ to, target = '_self', children }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (target === '_blank') {
            window.open(to, '_blank');
        } else {
            navigate(to);
        }
    };

    // clone the only child to inject props
    return React.cloneElement(children, {
        onClick: handleClick,
        style: { cursor: 'pointer', ...children.props.style },
    });
};

export default ClickableLink;
