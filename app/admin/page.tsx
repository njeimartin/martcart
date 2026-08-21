import AdminDashboard from './AdminDashboard';

// Admin requires authenticated browser-side Supabase state, so keep the route
// dynamic and let the client component handle authentication after hydration.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AdminPage() {
  return <AdminDashboard />;
}
