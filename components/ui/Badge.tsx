import React from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'purple';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'neutral', size = 'md', className }: BadgeProps) {
  const variantStyles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/10',
    warning: 'bg-amber-50 text-amber-800 border-amber-200 ring-amber-600/10',
    danger: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-600/10',
    info: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-600/10',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-600/10',
    purple: 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-600/10',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border shadow-sm ring-1 ring-inset',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}

export function VehicleStatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'AVAILABLE':
      return <Badge variant="success">Available</Badge>;
    case 'BOOKED':
      return <Badge variant="info">Booked</Badge>;
    case 'RENTED':
      return <Badge variant="purple">Active Rental</Badge>;
    case 'UNDER_MAINTENANCE':
      return <Badge variant="warning">Maintenance</Badge>;
    case 'ARCHIVED':
    case 'UNAVAILABLE':
      return <Badge variant="danger">Unavailable</Badge>;
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
}

export function BookingStatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'CONFIRMED':
      return <Badge variant="info">Confirmed</Badge>;
    case 'ACTIVE_RENTAL':
      return <Badge variant="purple">On Road / Active</Badge>;
    case 'COMPLETED':
      return <Badge variant="success">Completed</Badge>;
    case 'OVERDUE':
      return <Badge variant="danger">Overdue</Badge>;
    case 'PENDING':
      return <Badge variant="warning">Pending</Badge>;
    case 'CANCELLED':
      return <Badge variant="neutral">Cancelled</Badge>;
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
}

export function PaymentStatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'PAID':
      return <Badge variant="success">Paid</Badge>;
    case 'PARTIAL':
      return <Badge variant="warning">Partial</Badge>;
    case 'PENDING':
      return <Badge variant="danger">Pending</Badge>;
    case 'REFUNDED':
      return <Badge variant="neutral">Refunded</Badge>;
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
}

export function CustomerStatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'ACTIVE':
      return <Badge variant="success">Active</Badge>;
    case 'INACTIVE':
      return <Badge variant="neutral">Inactive</Badge>;
    case 'SUSPENDED':
      return <Badge variant="danger">Suspended</Badge>;
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
}
