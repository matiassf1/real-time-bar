import React from 'react';

const WebSocketConnection = ({ connected }) => {
  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">WebSocket Connection</h1>
      <div className={connected ? "text-green-500" : "text-red-500"}>
        {connected ? "Connected" : "Not connected"}
      </div>
    </div>
  );
};

export default WebSocketConnection;
