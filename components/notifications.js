// node_modules
import PropTypes from "prop-types";
import {
  DataArea,
  DataAreaTitle,
  DataItemLabel,
  DataItemValue,
  DataPanel,
} from "./data-area";
/**
 * display notifictions when query is failed
 */
export default function Notifications({ notifications }) {
  return (
    <>
      <DataAreaTitle>Error Notifications</DataAreaTitle>
      <DataPanel>
        <NotificationsList notifications={notifications}></NotificationsList>
      </DataPanel>
    </>
  );
}

Notifications.propTypes = {
  // notifications to display
  notifications: PropTypes.object.isRequired,
};

function NotificationsList({ notifications }) {
  return Object.keys(notifications).map((note, noteIdx) => (
    <DataArea key={noteIdx}>
      <DataItemLabel>{note}</DataItemLabel>
      <DataItemValue>{notifications[note]}</DataItemValue>
    </DataArea>
  ));
}

NotificationsList.propTypes = {
  // notifications to display
  notifications: PropTypes.object.isRequired,
};
