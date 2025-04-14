import Select from 'react-select';

const CustomSelect = (props) => {
    return (
        <Select
            {...props}
            menuPortalTarget={document.body}
            menuPosition="absolute"
            width="200"
            className="custom-select"
        />
    );
};

export default CustomSelect;
