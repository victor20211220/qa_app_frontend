import {Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';

const BackButton = ({to = ""}) => {
    return (
        <Button
            variant="link"
            className="text-muted p-0 d-flex align-items-center"
            style={{fontSize: '1.25rem'}}
            as={Link}
            to={to !== "" ? to: -1}
        >
            <i className="fa-solid fa-arrow-left"></i>
        </Button>
    );
};

export default BackButton;
