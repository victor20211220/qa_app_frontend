import {Card} from 'react-bootstrap';

const StatsCard = ({children}) => {
    return (
        <Card className="p-4 border-light shadow-sm rounded-4">
            {children}
        </Card>
    );
};

export default StatsCard;
