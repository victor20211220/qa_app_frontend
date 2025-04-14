import {useRef} from 'react';
import {Button, Form} from 'react-bootstrap';

const CustomFileInput = ({handlePhotoChange}) => {
    const fileInputRef = useRef();

    const handleClick = () => {
        fileInputRef.current.click();
    };

    return (
        <>
            <Form.Control
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                ref={fileInputRef}
                style={{display: 'none'}}
            />
            <Button
                variant="light"
                className="text-dark rounded py-3"
                onClick={handleClick} // optional handler
            >
                <i className="fa-solid fa-camera me-2"></i>
                Change Photo
            </Button>
        </>
    );
};

export default CustomFileInput;
