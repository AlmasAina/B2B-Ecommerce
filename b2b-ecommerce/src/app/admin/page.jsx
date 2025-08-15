'use client';

import SEOHead from '@/app/components/SEOHead';
import Dashboard from '@/app/components/admin/dashboard';

export default function AdminPage() {
    return (
        <>
            <SEOHead
                title="Admin Dashboard"
                description="Manage products, users, and sales analytics"
                noindex={true}
            />
            <Dashboard />
        </>
    );
}
