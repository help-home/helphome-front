'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('로딩 중...');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/test`)
      .then(res => res.text())
      .then(data => setMessage(data))
      .catch(err => {
        console.error('에러:', err);
        setError(err.message);
      });
  }, []);

  return (
    <div style={{ padding: '50px' }}>
      <h1>백엔드 연동 테스트</h1>
      <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL}</p>
      <p><strong>응답:</strong> {message}</p>
      {error && <p style={{ color: 'red' }}>에러: {error}</p>}
    </div>
  );
}
