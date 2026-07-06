import { useState } from 'react';
import { Alert, Box, Paper, Tab, Tabs, Typography } from '@mui/material';
import { can } from '@/features/auth/utils/permissions';
import { useAuthStore } from '@/store/authStore';
import CatalogTab from '../components/CatalogTab';
import { CATALOG_DEFINITIONS } from '../types/catalog.types';
import type { CatalogKind } from '../types/catalog.types';

const kinds = Object.keys(CATALOG_DEFINITIONS) as CatalogKind[];
const kindPermissions: Record<CatalogKind, string> = { industries: 'library:industry:manage', leadSources: 'library:lead-source:manage', painPoints: 'library:pain-point:manage', useCases: 'library:use-case:manage', personas: 'library:persona:manage', lookupOptions: 'lookup:manage' };

export default function AdminLibrariesPage() {
  const user = useAuthStore((state) => state.user);
  const availableKinds = kinds.filter((item) => can(user, kindPermissions[item], ['ADMIN']));
  const [kind, setKind] = useState<CatalogKind>(availableKinds[0] ?? 'industries');
  if (!availableKinds.length) return <Alert severity="warning">شما دسترسی مدیریت کتابخانه‌ها را ندارید.</Alert>;
  return <Box><Typography variant="h4" sx={{ mb: 0.5 }}>کتابخانه‌ها</Typography><Typography color="text.secondary" sx={{ mb: 2 }}>مدیریت داده‌های پایه و کاتالوگ‌های مورد استفاده در فرم‌ها.</Typography><Paper sx={{ mb: 2 }}><Tabs value={kind} onChange={(_, value: CatalogKind) => setKind(value)} variant="scrollable" scrollButtons="auto">{availableKinds.map((item) => <Tab key={item} value={item} label={CATALOG_DEFINITIONS[item].label} />)}</Tabs></Paper><CatalogTab key={kind} kind={kind} /></Box>;
}
