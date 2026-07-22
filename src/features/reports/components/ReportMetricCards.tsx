import { Grid } from '@mui/material';
import type { MetricCardTone, MetricComparison } from './ReportMetricCard';
import ReportMetricCard from './ReportMetricCard';
import { getMetricHelp, type MetricHelpKey } from '../metrics/metricHelpRegistry';

export interface ReportMetricItem {
  key: MetricHelpKey;
  label: string;
  value?: string;
  unavailable?: boolean;
  unavailableText?: string;
  contextLabel?: string;
  secondaryText?: string;
  tone?: MetricCardTone;
  statusLabel?: string;
  comparison?: MetricComparison;
}

export default function ReportMetricCards({ items, columns = 4 }: { items: readonly ReportMetricItem[]; columns?: 3 | 4 }) {
  return <Grid container spacing={2}>{items.map((item) => (
    <Grid key={item.key} size={{ xs: 12, sm: 6, md: 12 / columns }}>
      <ReportMetricCard {...item} help={getMetricHelp(item.key)} />
    </Grid>
  ))}</Grid>;
}
