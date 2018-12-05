import find from 'lodash/find';
import { getParameterByName } from '../../../helpers';

export function getEventDocuments(that) {
  const documents = [];
  let eventID = null;
  const paramEventID = that.props.params.eventId;
  const roomID = getParameterByName('zaal');
  let data = {};
  if (!roomID || paramEventID === roomID) {
    data = that.props.singleEvent.eventData.documents;
    eventID = paramEventID;
  } else if (roomID && that.props.singleEvent.childEventsData.length > 0) {
    const room = find(that.props.singleEvent.childEventsData, c => {
      return c.id === parseInt(roomID, 10);
    });
    data = room.documents;
    eventID = roomID;
  }
  for (let i = 0; i < data.length; i++) {
    documents.push({
      id: data[i].id,
      combined_id: data[i].combined_id,
      item_id: data[i].id,
      name: data[i].text,
    });
  }
  that.setState({
    initialDocuments: documents,
    eventID,
  });
}
