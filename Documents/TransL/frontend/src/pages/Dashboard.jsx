import React, { useEffect, useState } from 'react';
import { getMatches } from '../services/api';

const Dashboard = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    // Fetch AI Matches
    getMatches().then(res => setMatches(res.data.matches)).catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Team Rocket Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500">Fuel Saved</h3>
          <p className="text-2xl font-bold text-green-600">12%</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500">Load Utilization</h3>
          <p className="text-2xl font-bold text-blue-600">88%</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500">Active Matches</h3>
          <p className="text-2xl font-bold text-purple-600">{matches.length}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">AI Recommended Loads</h2>
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Cargo ID</th>
              <th className="p-3 text-left">Truck ID</th>
              <th className="p-3 text-left">Match Score</th>
              <th className="p-3 text-left">3D Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((m, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-3">#{m.cargo_id}</td>
                <td className="p-3">TRK-{m.truck_id}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-sm ${m.score > 0.8 ? 'bg-green-100 text-green-800' : 'bg-yellow-100'}`}>
                    {(m.score * 100).toFixed(0)}%
                  </span>
                </td>
                <td className="p-3 text-green-600">Optimized</td>
                <td className="p-3">
                  <button className="text-blue-600 hover:underline">Assign</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;