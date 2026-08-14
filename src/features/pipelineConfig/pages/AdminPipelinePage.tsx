import { useState } from 'react';
import { Alert, Box, Paper, Tab, Tabs, Typography } from '@mui/material';
import { can } from '@/features/auth/utils/permissions';
import { useAuthStore } from '@/store/authStore';
import StagesConfigTab from '../components/StagesConfigTab';
import TransitionRulesTab from '../components/TransitionRulesTab';

export default function AdminPipelinePage() {
  const user = useAuthStore((state) => state.user); const canManageStages = can(user, 'pipeline:config:manage'); const canManageTransitions = can(user, 'pipeline:transition:manage'); const canViewStages = canManageStages || can(user, 'pipeline:config:view'); const canViewTransitions = canManageTransitions || can(user, 'pipeline:transition:view'); const [tab, setTab] = useState<'stages' | 'transitions'>(canViewStages ? 'stages' : 'transitions');
  if (!canViewStages && !canViewTransitions) return <Alert severity="warning">شما دسترسی مشاهده تنظیمات پایپ‌لاین را ندارید.</Alert>;
  return <Box><Typography variant="h4" sx={{ mb: 0.5 }}>تنظیمات پایپ‌لاین</Typography><Typography color="text.secondary" sx={{ mb: 2 }}>مشاهده و مدیریت مراحل فروش و قوانین انتقال بین مراحل.</Typography><Paper sx={{ mb: 2 }}><Tabs value={tab} onChange={(_, value: 'stages' | 'transitions') => setTab(value)}>{canViewStages && <Tab value="stages" label="مراحل" />}{canViewTransitions && <Tab value="transitions" label="قوانین انتقال" />}</Tabs></Paper>{tab === 'stages' ? <StagesConfigTab canManage={canManageStages} /> : <TransitionRulesTab canManage={canManageTransitions} />}</Box>;
}
