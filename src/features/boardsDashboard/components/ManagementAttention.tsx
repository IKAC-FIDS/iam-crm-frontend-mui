import ErrorOutlineRounded from '@mui/icons-material/ErrorOutlineRounded';
import EventBusyRounded from '@mui/icons-material/EventBusyRounded';
import ScheduleRounded from '@mui/icons-material/ScheduleRounded';
import TaskAltRounded from '@mui/icons-material/TaskAltRounded';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import type { BoardsDashboardResponse } from '../types/boardsDashboard.types';

interface ManagementAttentionProps {
  attention: BoardsDashboardResponse['attention'];
}

export default function ManagementAttention({ attention }: ManagementAttentionProps) {
  const items = [
    {
      label: 'فرصت‌های با تاریخ بسته‌شدن گذشته',
      value: attention.overdueCloseCount,
      icon: ErrorOutlineRounded,
      detail: attention.overdueOpportunities.slice(0, 2).map((item) => item.title).join('، '),
    },
    {
      label: 'کارهای عقب‌افتاده',
      value: attention.overdueTasks.length,
      icon: TaskAltRounded,
      detail: attention.overdueTasks.slice(0, 2).map((item) => item.title).join('، '),
    },
    {
      label: 'جلسات زمان‌گذشته تعیین‌تکلیف‌نشده',
      value: attention.pastScheduledMeetings.length,
      icon: EventBusyRounded,
      detail: attention.pastScheduledMeetings.slice(0, 2).map((item) => item.title).join('، '),
    },
    {
      label: 'فرصت‌های بدون تاریخ بسته‌شدن',
      value: attention.opportunitiesWithoutCloseDate,
      icon: ScheduleRounded,
      detail: '',
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
          xl: 'repeat(4, minmax(0, 1fr))',
        },
        gap: 2,
      }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label} variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" spacing={1.25} sx={{ alignItems: "flex-start" }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: 'action.hover',
                    color: item.value > 0 ? 'warning.main' : 'success.main',
                    flexShrink: 0,
                  }}
                >
                  <Icon />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>
                    {item.value.toLocaleString('fa-IR')}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {item.label}
                  </Typography>
                  {item.detail ? (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: 'block',
                        mt: 0.75,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.detail}
                    </Typography>
                  ) : null}
                </Box>
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}
