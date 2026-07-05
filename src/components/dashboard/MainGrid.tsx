import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridPaginationModel } from '@mui/x-data-grid';

// ستون‌های نمونه برای جدول فعالیت‌ها
const columns: GridColDef[] = [
  { field: 'id', headerName: 'شناسه', width: 90 },
  { field: 'type', headerName: 'نوع', width: 120 },
  { field: 'company', headerName: 'شرکت', width: 150 },
  { field: 'person', headerName: 'شخص', width: 150 },
  { field: 'occurredAt', headerName: 'تاریخ', width: 180 },
];

export default function MainGrid() {
  const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });

  // نمونه داده‌های آماری (بعداً با API جایگزین می‌شه)
  const stats = {
    totalCompanies: 124,
    totalPeople: 345,
    pendingFollowUps: 18,
    meetingsToday: 5,
  };

  // نمونه داده‌های جدول
  const rows = [
    { id: 1, type: 'جلسه', company: 'شرکت الف', person: 'رضا احمدی', occurredAt: '۱۴۰۲/۰۱/۱۵' },
    { id: 2, type: 'تماس', company: 'شرکت ب', person: 'سارا محمدی', occurredAt: '۱۴۰۲/۰۱/۱۴' },
  ];

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      {/* کارت‌های آماری */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 2, md: 4 } }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="body2" color="text.secondary">
              تعداد شرکت‌ها
            </Typography>
            <Typography variant="h4">{stats.totalCompanies}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              تعداد اشخاص
            </Typography>
            <Typography variant="h4">{stats.totalPeople}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              پیگیری‌های امروز
            </Typography>
            <Typography variant="h4">{stats.pendingFollowUps}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              جلسات امروز
            </Typography>
            <Typography variant="h4">{stats.meetingsToday}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* جدول آخرین فعالیت‌ها */}
      <Paper sx={{ p: { xs: 1, sm: 2 }, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          آخرین فعالیت‌ها
        </Typography>
        <Box sx={{ height: 400, width: '100%', minWidth: 0 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 25]}
          />
        </Box>
      </Paper>
    </Box>
  );
}
