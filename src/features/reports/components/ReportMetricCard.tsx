import { useId, useRef, useState } from 'react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, Chip, IconButton, Paper, Popover, Stack, Tooltip, Typography } from '@mui/material';

export type MetricCardTone = 'default' | 'success' | 'warning' | 'error' | 'info';
export interface MetricHelpContent { title: string; description: string }
export interface MetricComparison { previousValue?: string; absoluteChange?: string; percentChange?: string | null; direction?: 'UP' | 'DOWN' | 'UNCHANGED'; isImprovement?: boolean | null }
export interface ReportMetricCardProps { label: string; value?: string; unavailable?: boolean; unavailableText?: string; help?: MetricHelpContent; contextLabel?: string; secondaryText?: string; tone?: MetricCardTone; statusLabel?: string; comparison?: MetricComparison }

export interface MetricHelpButtonProps { label: string; help: MetricHelpContent }
interface MetricHelpPopoverProps { anchor: HTMLElement | null; open: boolean; onClose: () => void; id: string; title: string; description: string; accessibleLabel: string }

const toneColor = { default: 'divider', success: 'success.main', warning: 'warning.main', error: 'error.main', info: 'info.main' } as const;
const directionLabel = { UP: 'افزایش', DOWN: 'کاهش', UNCHANGED: 'بدون تغییر' } as const;

function MetricHelpPopover({ anchor, open, onClose, id, title, description, accessibleLabel }: MetricHelpPopoverProps) {
  return <Popover
    id={id}
    open={open}
    anchorEl={anchor}
    onClose={onClose}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    slotProps={{ paper: { dir: 'rtl', lang: 'fa', role: 'dialog', 'aria-label': accessibleLabel, sx: { direction: 'rtl', textAlign: 'right', width: 'min(400px, calc(100vw - 32px))', maxWidth: 400, p: 2, overflowWrap: 'anywhere' } } }}
  >
    <Box dir="rtl" lang="fa" sx={{ direction: 'rtl', textAlign: 'right', width: '100%', '& .MuiTypography-root': { direction: 'rtl', textAlign: 'right' } }}>
      <Typography variant="h6" sx={{ direction: 'rtl', textAlign: 'right', overflowWrap: 'anywhere' }}>{title}</Typography>
      <Typography variant="body2" sx={{ mt: 1.25, lineHeight: 2, direction: 'rtl', textAlign: 'right', whiteSpace: 'normal', overflowWrap: 'anywhere' }}>{description}</Typography>
    </Box>
  </Popover>;
}

export default function ReportMetricCard({ label, value, unavailable = false, unavailableText = 'داده در دسترس نیست.', help, contextLabel, secondaryText, tone = 'default', statusLabel, comparison }: ReportMetricCardProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null); const buttonRef = useRef<HTMLButtonElement>(null); const id = useId();
  const close = () => { setAnchor(null); requestAnimationFrame(() => buttonRef.current?.focus()); };
  return <Paper sx={{ p: 2, height: '100%', minWidth: 0, borderTop: 3, borderColor: toneColor[tone] }}>
    <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, minHeight: 32 }}>
      <Box sx={{ minWidth: 0 }}><Typography variant="body2" color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>{label}</Typography>{contextLabel && <Typography variant="caption" color="text.secondary">{contextLabel}</Typography>}</Box>
      {help && <Tooltip title="توضیح شاخص"><IconButton ref={buttonRef} size="small" aria-label={`توضیح درباره ${label}`} aria-haspopup="dialog" aria-expanded={Boolean(anchor)} aria-controls={anchor ? id : undefined} onClick={(event) => { event.stopPropagation(); setAnchor(event.currentTarget); }} sx={{ width: 32, height: 32, flex: '0 0 auto' }}><InfoOutlinedIcon sx={{ fontSize: 18 }} /></IconButton></Tooltip>}
    </Stack>
    <Typography variant={unavailable ? 'body1' : 'h4'} color={unavailable ? 'text.secondary' : 'text.primary'} sx={{ mt: 1, overflowWrap: 'anywhere' }}>{unavailable ? unavailableText : value ?? '—'}</Typography>
    {secondaryText && <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>{secondaryText}</Typography>}
    {statusLabel && <Chip size="small" label={statusLabel} color={tone === 'default' ? 'default' : tone} sx={{ mt: 1 }} />}
    {comparison && <Stack spacing={0.5} sx={{ mt: 1.5 }}><Typography variant="caption" color="text.secondary">دوره مقایسه: {comparison.previousValue ?? '—'}</Typography><Typography variant="caption" color={comparison.isImprovement === true ? 'success.main' : comparison.isImprovement === false ? 'error.main' : 'text.secondary'}>{comparison.direction ? directionLabel[comparison.direction] : 'تغییر'}{comparison.percentChange === null ? ' · تغییر درصدی قابل محاسبه نیست' : comparison.percentChange ? ` · ${comparison.percentChange}` : ''}</Typography></Stack>}
    {help && <MetricHelpPopover anchor={anchor} open={Boolean(anchor)} onClose={close} id={id} title={help.title} description={help.description} accessibleLabel={help.title} />}
  </Paper>;
}

export function MetricHelpButton({ label, help }: MetricHelpButtonProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const id = useId();
  const close = () => { setAnchor(null); requestAnimationFrame(() => buttonRef.current?.focus()); };
  return <>
    <Tooltip title="توضیح شاخص"><IconButton ref={buttonRef} size="small" aria-label={`توضیح درباره ${label}`} aria-haspopup="dialog" aria-expanded={Boolean(anchor)} aria-controls={anchor ? id : undefined} onClick={(event) => setAnchor(event.currentTarget)} sx={{ width: 32, height: 32, flex: '0 0 auto' }}><InfoOutlinedIcon sx={{ fontSize: 18 }} /></IconButton></Tooltip>
    <MetricHelpPopover anchor={anchor} open={Boolean(anchor)} onClose={close} id={id} title={help.title} description={help.description} accessibleLabel={help.title} />
  </>;
}
