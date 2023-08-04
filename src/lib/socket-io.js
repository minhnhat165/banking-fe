import React, { useEffect } from 'react';

import socket from 'src/configs/socket-config';
import { useAuth } from 'src/hooks/use-auth';

const SocketClient = () => {
  const { user, updateProfile } = useAuth();
  useEffect(() => {
    socket.connect();
    function onConnect() {
      if (user?.id) {
        socket.emit('client.join', user.id);
      }
    }

    function onDisconnect() {
      console.log('disconnected');
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('server.permission.update', (data) => {
      updateProfile({
        permissions: data,
      });
    });

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('server.permission.update');
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return <></>;
};

export default SocketClient;
