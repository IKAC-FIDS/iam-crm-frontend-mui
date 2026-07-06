import { useState } from 'react';
import { Alert, Box, Paper, Tab, Tabs, Typography } from '@mui/material';
import { can } from '@/features/auth/utils/permissions';
import { useAuthStore } from '@/store/authStore';
import StagesConfigTab from '../components/StagesConfigTab';
import TransitionRulesTab from '../components/TransitionRulesTab';

export default function AdminPipelinePage() {
  const user = useAuthStore((state) => state.user); const allowed = can(user, 'pipeline:manage', ['ADMIN']); const [tab, setTab] = useState(0);
  if (!allowed) return <Alert severity="warning">شما دسترسی مدیریت تنظیمات پایپ‌لاین را ندارید.</Alert>;
  return <Box><Typography variant="h4" sx={{ mb: 0.5 }}>تنظیمات پایپ‌لاین</Typography><Typography color="text.secondary" sx={{ mb: 2 }}>مدیریت مراحل فروش و قوانین انتقال بین مراحل.</Typography><Paper sx={{ mb: 2 }}><Tabs value={tab} onChange={(_, value: number) => setTab(value)}><Tab label="مراحل" /><Tab label="قوانین انتقال" /></Tabs></Paper>{tab === 0 ? <StagesConfigTab /> : <TransitionRulesTab />}</Box>;
}
