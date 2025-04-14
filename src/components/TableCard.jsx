import {Card, Row} from 'react-bootstrap';

const TableCard = ({header, body, footer}) => {
    return (
        <Card className="rounded-4 shadow-sm border border-light-subtle overflow-hidden bg-white mb-4 p-0">
            {header && (
                <Card.Header className="bg-white border-bottom p-4">
                    <Row className="align-items-center justify-content-between">
                        {header}
                    </Row>
                </Card.Header>
            )}

            <Card.Body>{body}</Card.Body>

            {footer && (
                <Card.Footer className="bg-white p-4 border-0">
                    <div className="d-flex justify-content-between align-items-center">
                        {footer}
                    </div>
                </Card.Footer>
            )}
        </Card>
    );
};

export default TableCard;
