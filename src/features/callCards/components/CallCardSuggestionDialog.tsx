import {
  Alert,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import type { CallCardSuggestion } from '../types/callCard.types';

interface Props {
  open: boolean;
  suggestion?: CallCardSuggestion;
  isLoading: boolean;
  isError: boolean;
  onApply: () => void;
  onClose: () => void;
}

function TextPreview({ label, value }: { label: string; value?: string | null }) {
  if (!value?.trim()) return null;
  return <div><Typography variant="subtitle2">{label}</Typography><Typography sx={{ whiteSpace: 'pre-wrap' }}>{value}</Typography></div>;
}

export default function CallCardSuggestionDialog({ open, suggestion, isLoading, isError, onApply, onClose }: Props) {
  return (
    <Dialog open={open} onClose={isLoading ? undefined : onClose} fullWidth maxWidth="md">
      <DialogTitle>پیشنهادهای کال کارت</DialogTitle>
      <DialogContent>
        {isLoading && <Typography>در حال دریافت پیشنهادات...</Typography>}
        {isError && <Alert severity="error">خطا در دریافت پیشنهادات کال کارت.</Alert>}
        {suggestion && (
          <Stack spacing={3} sx={{ pt: 1 }}>
            {suggestion.suggestedPainPoints?.length ? <div><Typography variant="subtitle2">نقاط درد پیشنهادی</Typography><Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, mt: 1 }}>{suggestion.suggestedPainPoints.map((item) => <Chip key={item} label={item} />)}</Stack></div> : null}
            {suggestion.suggestedUseCases?.length ? <div><Typography variant="subtitle2">کاربردهای پیشنهادی</Typography><Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, mt: 1 }}>{suggestion.suggestedUseCases.map((item) => <Chip key={item} label={item} />)}</Stack></div> : null}
            {suggestion.matchedPersonas?.length ? <Typography>پرسوناهای مرتبط: {suggestion.matchedPersonas.length} مورد</Typography> : null}
            {suggestion.matchedIndustry != null ? <Typography>صنعت تطبیق‌داده‌شده در پیشنهاد موجود است.</Typography> : null}
            <Typography variant="h6">پیش‌نویس کال کارت</Typography>
            <TextPreview label="زاویه ورود" value={suggestion.entryAngle} />
            <TextPreview label="نقطه درد" value={suggestion.painPoint} />
            <TextPreview label="کاربرد پیشنهادی" value={suggestion.useCase} />
            <TextPreview label="هدف تماس" value={suggestion.callGoal} />
            <TextPreview label="جمله شروع تماس" value={suggestion.openingLine} />
            <TextPreview label="متن ایمیل اول" value={suggestion.firstEmail} />
            <TextPreview label="پیام لینکدین" value={suggestion.linkedinMsg} />
            {!suggestion.entryAngle && !suggestion.painPoint && !suggestion.useCase && !suggestion.openingLine && !suggestion.firstEmail && !suggestion.linkedinMsg && !suggestion.suggestedPainPoints?.length && !suggestion.suggestedUseCases?.length && (
              <Typography color="text.secondary">پیشنهاد قابل نمایشی دریافت نشد؛ می‌توانید فرم را به‌صورت دستی تکمیل کنید.</Typography>
            )}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>بستن</Button>
        <Button variant="contained" onClick={onApply} disabled={!suggestion || isLoading}>اعمال پیشنهادات در فرم</Button>
      </DialogActions>
    </Dialog>
  );
}
