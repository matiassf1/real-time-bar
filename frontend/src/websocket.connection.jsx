import React from 'react';

const WebSocketConnection = ({ connected, content }) => {
  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">{content}</h1>
      <div className={connected ? "text-green-500" : "text-red-500"}>
        {connected ? "Receiving" : "Not receiving"}
      </div>
    </div>
  );
};

export default WebSocketConnection;
