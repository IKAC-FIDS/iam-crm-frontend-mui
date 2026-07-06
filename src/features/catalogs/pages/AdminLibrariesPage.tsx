import { useState } from 'react';
import { Alert, Box, Paper, Tab, Tabs, Typography } from '@mui/material';
import { can } from '@/features/auth/utils/permissions';
import { useAuthStore } from '@/store/authStore';
import CatalogTab from '../components/CatalogTab';
import { CATALOG_DEFINITIONS } from '../types/catalog.types';
import type { CatalogKind } from '../types/catalog.types';

const kinds = Object.keys(CATALOG_DEFINITIONS) as CatalogKind[];

export default function AdminLibrariesPage() {
  const user = useAuthStore((state) => state.user);
  const allowed = can(user, 'catalog:manage', ['ADMIN']);
  const [kind, setKind] = useState<CatalogKind>('industries');
  if (!allowed) return <Alert severity="warning">شما دسترسی مدیریت کتابخانه‌ها را ندارید.</Alert>;
  return <Box><Typography variant="h4" sx={{ mb: 0.5 }}>کتابخانه‌ها</Typography><Typography color="text.secondary" sx={{ mb: 2 }}>مدیریت داده‌های پایه و کاتالوگ‌های مورد استفاده در فرم‌ها.</Typography><Paper sx={{ mb: 2 }}><Tabs value={kind} onChange={(_, value: CatalogKind) => setKind(value)} variant="scrollable" scrollButtons="auto">{kinds.map((item) => <Tab key={item} value={item} label={CATALOG_DEFINITIONS[item].label} />)}</Tabs></Paper><CatalogTab key={kind} kind={kind} /></Box>;
}
