import AdminPortal from './AdminPortal';

export const metadata = {
  title: 'Vaigoo Innovations | Internal Admin',
  robots: 'noindex, nofollow' // CRITICAL: Stop search engines from indexing this secret route
};

export default function AdminPage() {
  return <AdminPortal />;
}
