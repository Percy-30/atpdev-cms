import { 
  getSorteosGiveaways, 
  getSorteosUsers, 
  getSorteosFeatureFlags, 
  getSorteosMetrics, 
  getSubdomainConfig 
} from '@atpdev/database';
import SorteosAdminClient from './SorteosAdminClient';

export const dynamic = 'force-dynamic';

export default async function SorteosAdminPage() {
  const [giveaways, users, featureFlags, metrics, config] = await Promise.all([
    getSorteosGiveaways(),
    getSorteosUsers(),
    getSorteosFeatureFlags(),
    getSorteosMetrics(),
    getSubdomainConfig('sorteos')
  ]);

  return (
    <SorteosAdminClient 
      initialGiveaways={giveaways}
      initialUsers={users}
      initialFeatureFlags={featureFlags}
      initialMetrics={metrics}
      initialConfig={config}
    />
  );
}
