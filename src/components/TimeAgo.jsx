import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const TimeAgo = ({dateValue}) => {
    if (!dateValue) return null;
    return (
        <span title={dateValue} className="text-muted text-14">
          {dayjs(dateValue).fromNow()}
        </span>
    );
};

export default TimeAgo;
