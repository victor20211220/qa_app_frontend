// components/WithTitle.tsx
import {useEffect} from 'react';
import {useLocation} from "react-router";


const WithTitle = ({title, children}) => {
    useEffect(() => {
        document.title = `YouMentor.Me${title ? ` - ${title}` : ''}`;
    }, [title]);

    const {pathname} = useLocation();
    useEffect(() => {
        window.scrollTo({top: 0, behavior: 'smooth'}); // or just window.scrollTo(0, 0);
    }, [pathname]);

    return <>{children}</>;
};

export default WithTitle;
