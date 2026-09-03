import { getJobPostings } from '@atpdev/database';
import ChambaAdminClient from './ChambaAdminClient';

export const dynamic = 'force-dynamic';

export default async function ChambaAdminPage() {
  const jobs = await getJobPostings();

  return <ChambaAdminClient initialJobs={jobs} />;
}
