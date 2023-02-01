import React from "react";

import { Event } from "@analytics/shared";

interface IProps {
  events: Event[];
}

const EventList: React.FC<IProps> = ({ events }) => {
  return (
    <ul>
      {events.map((e, i) => (
        <li key={i}>{e.properties.host}</li>
      ))}
    </ul>
  );
};

export default EventList;
