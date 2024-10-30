import { Button } from '@/common/ui/components/button';
import { logoutAction } from '../_actions/authActions';

export default async function Dashboard() {
  return (
    <div>
      <p>Welcome to dashboard page</p>
      <Button onClick={logoutAction}>Logout</Button>
    </div>
  );
}
