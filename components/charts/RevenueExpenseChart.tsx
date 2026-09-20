'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface ChartProps {
  data?: {
    month: string;
    revenue: number;
    expenses: number;
    netProfit: number;
  }[];
}

const defaultData = [
  { month: 'Apr', revenue: 420000, expenses: 140000, netProfit: 280000 },
  { month: 'May', revenue: 560000, expenses: 180000, netProfit: 380000 },
  { month: 'Jun', revenue: 710000, expenses: 220000, netProfit: 490000 },
  { month: 'Jul', revenue: 840000, expenses: 250000, netProfit: 590000 },
  { month: 'Aug', revenue: 920000, expenses: 290000, netProfit: 630000 },
  { month: 'Sep', revenue: 785000, expenses: 215000, netProfit: 570000 },
];

export function RevenueExpenseChart({ data = defaultData }: ChartProps) {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            tickFormatter={(v) => `₹${Math.round(v / 1000)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              fontSize: '12px',
            }}
            formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, '']}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          <Area
            type="monotone"
            dataKey="revenue"
            name="Gross Revenue (INR)"
            stroke="#10b981"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorRevenue)"
          />
          <Area
            type="monotone"
            dataKey="netProfit"
            name="Net Profit (INR)"
            stroke="#0284c7"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorProfit)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
