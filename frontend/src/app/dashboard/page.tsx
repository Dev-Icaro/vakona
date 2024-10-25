import { Button } from '@/common/ui/components/button';
import { logoutAction } from '../_actions/authActions';
import { auth } from '@/config/auth';

export default async function Dashboard() {
  const session = await auth();

  return (
    <div>
      <p>Welcome to dashboard page</p>
      <Button onClick={logoutAction}>Logout</Button>
      {JSON.stringify(session?.user)}
    </div>
  );
}
