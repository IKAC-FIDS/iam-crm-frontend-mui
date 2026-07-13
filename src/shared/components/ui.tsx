import type { ReactNode } from 'react';
import { Alert, Box, Paper, Stack, Typography } from '@mui/material';
import type { AlertColor, SxProps, Theme } from '@mui/material';

export function PageContainer({ children, sx }: { children: ReactNode; sx?: SxProps<Theme> }) {
  return (
    <Box
      sx={[
        {
          width: '100%',
          maxWidth: 1680,
          mx: 'auto',
          minWidth: 0,
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {children}
    </Box>
  );
}

export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
  sx,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  eyebrow?: ReactNode;
  sx?: SxProps<Theme>;
}) {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      sx={[
        {
          mb: 3,
          justifyContent: 'space-between',
          alignItems: { md: 'flex-start' },
          minWidth: 0,
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      <Box sx={{ minWidth: 0 }}>
        {eyebrow && <Typography variant="caption" color="text.secondary">{eyebrow}</Typography>}
        <Typography variant="h4" component="h1" sx={{ overflowWrap: 'anywhere' }}>
          {title}
        </Typography>
        {description && (
          <Typography color="text.secondary" sx={{ mt: 0.75, maxWidth: 900 }}>
            {description}
          </Typography>
        )}
      </Box>
      {actions && <ResponsiveActionGroup>{actions}</ResponsiveActionGroup>}
    </Stack>
  );
}

export function ResponsiveActionGroup({ children, sx }: { children: ReactNode; sx?: SxProps<Theme> }) {
  return (
    <Stack
      direction="row"
      spacing={1}
      useFlexGap
      sx={[
        {
          flexWrap: 'wrap',
          justifyContent: { xs: 'flex-start', md: 'flex-end' },
          alignItems: 'center',
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {children}
    </Stack>
  );
}

export function PageSection({
  title,
  description,
  actions,
  children,
  variant = 'paper',
  sx,
}: {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  variant?: 'paper' | 'plain';
  sx?: SxProps<Theme>;
}) {
  const content = (
    <Stack spacing={2}>
      {(title || description || actions) && (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}>
          <Box sx={{ minWidth: 0 }}>
            {title && <Typography variant="h6">{title}</Typography>}
            {description && <Typography color="text.secondary">{description}</Typography>}
          </Box>
          {actions && <ResponsiveActionGroup>{actions}</ResponsiveActionGroup>}
        </Stack>
      )}
      {children}
    </Stack>
  );

  if (variant === 'plain') {
    return <Box sx={sx}>{content}</Box>;
  }

  return (
    <Paper
      sx={[
        {
          p: { xs: 2, md: 3 },
          overflow: 'hidden',
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {content}
    </Paper>
  );
}

export function FilterPanel({ children, title = 'فیلترها', sx }: { children: ReactNode; title?: ReactNode; sx?: SxProps<Theme> }) {
  return (
    <PageSection title={title} sx={sx}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' },
          gap: 2,
          alignItems: 'start',
        }}
      >
        {children}
      </Box>
    </PageSection>
  );
}

export function StateBlock({
  title,
  description,
  severity = 'info',
  action,
}: {
  title: ReactNode;
  description?: ReactNode;
  severity?: AlertColor;
  action?: ReactNode;
}) {
  return (
    <Alert severity={severity} action={action} sx={{ alignItems: 'flex-start' }}>
      <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
      {description && <Typography variant="body2" sx={{ mt: 0.5 }}>{description}</Typography>}
    </Alert>
  );
}
