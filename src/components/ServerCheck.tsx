import { useEffect, useState } from 'react';

const ServerCheck = () => {
  const [serverStatus, setServerStatus] = useState<'checking' | 'working' | 'not-working'>('checking');
  const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const checkServer = async () => {
    try {
      const response = await fetch(`${serverUrl}/check`);
      if (response.ok) {
        setServerStatus('working');
      } else {
        setServerStatus('not-working');
      }
    } catch (error) {
      setServerStatus('not-working');
    }
  };

  useEffect(() => {
    checkServer();
    // const interval = setInterval(checkServer, 5000);
    // return () => clearInterval(interval);
  }, []);

  if (serverStatus === 'working') {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          padding: '40px',
          borderRadius: '10px',
          textAlign: 'center',
          fontSize: '24px',
          fontWeight: 'bold',
          backgroundColor: serverStatus === 'checking' ? '#fff3cd' : '#f8d7da',
          color: serverStatus === 'checking' ? '#856404' : '#721c24',
        }}
      >
        {serverStatus === 'checking' ? 'Checking server...' : "server doesn't work"}
      </div>
    </div>
  );
};

export default ServerCheck;
