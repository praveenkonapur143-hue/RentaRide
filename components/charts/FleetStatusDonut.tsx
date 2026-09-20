'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface FleetStatusDonutProps {
  summary?: {
    available: number;
    booked: number;
    rented: number;
    underMaintenance: number;
  };
}

export function FleetStatusDonut({ summary }: FleetStatusDonutProps) {
  const data = [
    { name: 'Available', value: summary?.available || 6, color: '#10b981' },
    { name: 'On Road / Rented', value: summary?.rented || 2, color: '#8b5cf6' },
    { name: 'Booked', value: summary?.booked || 1, color: '#3b82f6' },
    { name: 'Maintenance', value: summary?.underMaintenance || 2, color: '#f59e0b' },
  ];

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              fontSize: '12px',
            }}
          />
          <Legend
            verticalAlign="bottom"
            wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
