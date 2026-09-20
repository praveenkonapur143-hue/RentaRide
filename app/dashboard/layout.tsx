'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; name: string; email: string; role: 'ADMIN' | 'STAFF' | 'CUSTOMER' } | null>({
    id: 'usr-admin-01',
    name: 'Rajesh Menon',
    email: 'admin@rentaride.com',
    role: 'ADMIN',
  });

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col print:bg-white">
      {/* Sidebar navigation */}
      <div className="print:hidden">
        <Sidebar
          userRole={user?.role || 'ADMIN'}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main content wrapper shifted on desktop */}
      <div className="lg:pl-72 flex flex-col flex-1 min-w-0 print:pl-0">
        <div className="print:hidden">
          <Header
            onMenuClick={() => setSidebarOpen(true)}
            user={user}
          />
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto print:p-0 print:max-w-none">
          {children}
        </main>
      </div>
    </div>
  );
}
