import type { ReactNode } from 'react';
import { Card, CardContent, Stack, Typography } from '@mui/material';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  minHeight?: number;
}

export default function ChartCard({
  title,
  subtitle,
  children,
  minHeight = 360,
}: ChartCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        minHeight,
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ height: '100%', p: { xs: 2, sm: 2.5 } }}>
        <Stack spacing={0.5} sx={{ mb: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          {subtitle ? (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          ) : null}
        </Stack>
        {children}
      </CardContent>
    </Card>
  );
}
