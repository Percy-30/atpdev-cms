import { getJobPostings, getSubdomainConfig } from '@atpdev/database';
import ChambaAdminClient from './ChambaAdminClient';

export const dynamic = 'force-dynamic';

export default async function ChambaAdminPage() {
  const [jobs, config] = await Promise.all([
    getJobPostings(),
    getSubdomainConfig('chamba')
  ]);

  return <ChambaAdminClient initialJobs={jobs} initialConfig={config} />;
}
