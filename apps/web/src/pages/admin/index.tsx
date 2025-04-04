import { requireAuth } from '@/server/lib/auth';
import ManageEventsPage from './manage-events';

export const getServerSideProps = (ctx) =>
  requireAuth(ctx, { organizerOnly: true });

export default function AdminPage({ children }) {
  return (
    <div>
      <ManageEventsPage />
    </div>
  );
}
