import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import AttachmentsTab from '@/features/attachments/components/AttachmentsTab';
import type { Meeting } from '../types/meeting.types';

export interface MeetingAttachmentsDialogProps {
  meeting: Meeting | null;
  open: boolean;
  onClose: () => void;
}

export default function MeetingAttachmentsDialog({ meeting, open, onClose }: MeetingAttachmentsDialogProps) {
  return <Dialog open={open && Boolean(meeting)} onClose={onClose} fullWidth maxWidth="lg" dir="rtl" slotProps={{ paper: { sx: { direction: 'rtl', maxWidth: 'min(1200px, calc(100vw - 24px))', m: { xs: 1.5, sm: 4 }, minWidth: 0 } } }}>
    <DialogTitle sx={{ textAlign: 'right' }}>صورتجلسه و مستندات{meeting?.title ? <Typography component="span" color="text.secondary"> — {meeting.title}</Typography> : null}</DialogTitle>
    <DialogContent sx={{ pt: '12px !important', px: { xs: 1.5, sm: 3 }, minWidth: 0, overflowX: 'hidden' }}>
      {meeting && <AttachmentsTab
        entityType="MEETING"
        entityId={meeting.id}
        title="صورتجلسه و مستندات جلسه"
        emptyMessage="هنوز صورتجلسه یا مستندی برای این جلسه ثبت نشده است."
        uploadButtonLabel="بارگذاری صورتجلسه یا مستند"
        uploadDialogTitle="بارگذاری صورتجلسه یا مستند جلسه"
        descriptionLabel="عنوان یا توضیح فایل"
      />}
    </DialogContent>
    <DialogActions><Button onClick={onClose}>بستن</Button></DialogActions>
  </Dialog>;
}
