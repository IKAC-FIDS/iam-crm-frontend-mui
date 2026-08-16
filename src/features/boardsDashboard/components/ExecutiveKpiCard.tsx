import ArrowDownwardRounded from '@mui/icons-material/ArrowDownwardRounded';
import ArrowUpwardRounded from '@mui/icons-material/ArrowUpwardRounded';
import RemoveRounded from '@mui/icons-material/RemoveRounded';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import type { BoardsMetric } from '../types/boardsDashboard.types';
import { formatChange, formatMetric } from '../utils/boardsDashboardFormatters';

interface ExecutiveKpiCardProps {
  label: string;
  metric: BoardsMetric;
  helper?: string;
}

export default function ExecutiveKpiCard({
  label,
  metric,
  helper = 'نسبت به دوره قبل',
}: ExecutiveKpiCardProps) {
  const change = formatChange(metric.changePercent);
  const positive = metric.isImprovement === true;
  const negative = metric.isImprovement === false;
  const tone = positive ? 'success.main' : negative ? 'error.main' : 'text.secondary';

  const DirectionIcon =
    metric.direction === 'UP'
      ? ArrowUpwardRounded
      : metric.direction === 'DOWN'
        ? ArrowDownwardRounded
        : RemoveRounded;

  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          insetInlineStart: 0,
          top: 0,
          bottom: 0,
          width: 4,
          bgcolor: tone,
          opacity: 0.75,
        },
      }}
    >
      <CardContent sx={{ p: 2.25, '&:last-child': { pb: 2.25 } }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {label}
        </Typography>

        <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.35 }}>
          {formatMetric(metric)}
        </Typography>

        <Box sx={{ minHeight: 32, mt: 1 }}>
          {change ? (
            <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
              <DirectionIcon sx={{ fontSize: 18, color: tone }} />
              <Typography variant="caption" sx={{ color: tone, fontWeight: 700 }}>
                {change}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {helper}
              </Typography>
            </Stack>
          ) : (
            <Typography variant="caption" color="text.secondary">
              داده مقایسه‌ای موجود نیست
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
