import { Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { formatDateTime, getPriorityLabel } from '@/features/companies/utils/companyDisplay';
import type { Opportunity } from '../types/opportunity.types';
const show = (value?: string | null) => value?.trim() || 'â€”';
export default function OpportunityCard({ opportunity, canChangeStage, onChangeStage }: { opportunity: Opportunity; canChangeStage: boolean; onChangeStage: (item: Opportunity) => void }) { const navigate = useNavigate(); return <Card variant="outlined"><CardContent><Stack spacing={1}>
  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{opportunity.title}</Typography>
  <Typography variant="body2">Ø´Ø±Ú©Øª: {show(opportunity.company?.brandName || opportunity.company?.legalName)}</Typography>
  <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}><Chip size="small" label={`Ø§ÙˆÙ„ÙˆÛŒØª: ${getPriorityLabel(opportunity.priority)}`} /><Typography variant="caption">Ù…Ø§Ù„Ú©: {show(opportunity.owner?.fullName)}</Typography></Stack>
  <Typography variant="caption">ØªØ§Ø±ÛŒØ® Ø¨Ø³ØªÙ‡â€ŒØ´Ø¯Ù†: {opportunity.expectedCloseDate ? formatDateTime(opportunity.expectedCloseDate) : 'â€”'}</Typography>
  <Typography variant="caption">Ø§Ø±Ø²Ø´ ØªØ®Ù…ÛŒÙ†ÛŒ: {opportunity.estimatedValue == null ? 'â€”' : Number(opportunity.estimatedValue).toLocaleString('fa-IR')}</Typography>
  <Stack direction="row"><Button size="small" onClick={() => navigate(`/companies/${opportunity.companyId}`, { state: { backTo: '/pipeline', backLabel: 'Ø¨Ø§Ø²Ú¯Ø´Øª Ø¨Ù‡ Ù¾Ø§ÛŒÙ¾â€ŒÙ„Ø§ÛŒÙ†' } })}>Ù…Ø´Ø§Ù‡Ø¯Ù‡ Ø´Ø±Ú©Øª</Button>{canChangeStage && <Button size="small" onClick={() => onChangeStage(opportunity)}>ØªØºÛŒÛŒØ± Ù…Ø±Ø­Ù„Ù‡</Button>}</Stack>
</Stack></CardContent></Card>; }

