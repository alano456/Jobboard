import { useState, useEffect } from 'react';
import api from '../api';

export const TestConnection = () => {
    const [status, setStatus] = useState('Checking connection...');
    const [count, setCount] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkConnection = async () => {
            try {
                // Fetch jobs as a test endpoint
                const response = await api.get('/jobs/');
                // Assuming pagination or list
                const jobCount = response.data.count || response.data.results?.length || response.data.length || 0;
                setStatus('Connected!');
                setCount(jobCount);
            } catch (err) {
                console.error("Connection failed:", err);
                setStatus('Connection failed');
                setError(err.message);
            }
        };

        checkConnection();
    }, []);

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '20px 0', background: '#f9f9f9', color: '#333' }}>
            <h3>Backend Connection Status</h3>
            <p><strong>Status:</strong> {status}</p>
            {count !== null && <p><strong>Jobs found:</strong> {count}</p>}
            {error && <p style={{ color: 'red' }}><strong>Error:</strong> {error}</p>}
        </div>
    );
};
