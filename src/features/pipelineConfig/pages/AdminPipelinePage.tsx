import { useState } from 'react';
import { Alert, Box, Paper, Tab, Tabs, Typography } from '@mui/material';
import { can } from '@/features/auth/utils/permissions';
import { useAuthStore } from '@/store/authStore';
import StagesConfigTab from '../components/StagesConfigTab';
import TransitionRulesTab from '../components/TransitionRulesTab';

export default function AdminPipelinePage() {
  const user = useAuthStore((state) => state.user); const canManageStages = can(user, 'pipeline:config:manage', ['ADMIN']); const canManageTransitions = can(user, 'pipeline:transition:manage', ['ADMIN']); const [tab, setTab] = useState<'stages' | 'transitions'>(canManageStages ? 'stages' : 'transitions');
  if (!canManageStages && !canManageTransitions) return <Alert severity="warning">شما دسترسی مدیریت تنظیمات پایپ‌لاین را ندارید.</Alert>;
  return <Box><Typography variant="h4" sx={{ mb: 0.5 }}>تنظیمات پایپ‌لاین</Typography><Typography color="text.secondary" sx={{ mb: 2 }}>مدیریت مراحل فروش و قوانین انتقال بین مراحل.</Typography><Paper sx={{ mb: 2 }}><Tabs value={tab} onChange={(_, value: 'stages' | 'transitions') => setTab(value)}>{canManageStages && <Tab value="stages" label="مراحل" />}{canManageTransitions && <Tab value="transitions" label="قوانین انتقال" />}</Tabs></Paper>{tab === 'stages' ? <StagesConfigTab /> : <TransitionRulesTab />}</Box>;
}
