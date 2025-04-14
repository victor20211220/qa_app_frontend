import {Button} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';

const BackButton = () => {
    const navigate = useNavigate();

    return (
        <Button
            variant="link"
            className="text-muted p-0 d-flex align-items-center"
            style={{fontSize: '1.25rem'}}
            onClick={() => navigate(-1)}
        >
            <i className="fa-solid fa-arrow-left"></i>
        </Button>
    );
};

export default BackButton;
