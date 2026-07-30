import { Box, CircularProgress } from '@mui/material';

export default function RouteLoadingFallback() {
  return (
    <Box role="status" aria-label="در حال بارگذاری صفحه" sx={{ minHeight: 240, display: 'grid', placeItems: 'center' }}>
      <CircularProgress size={36} />
    </Box>
  );
}
