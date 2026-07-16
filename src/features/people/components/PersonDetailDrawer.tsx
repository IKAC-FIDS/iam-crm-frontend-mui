import { useState } from 'react';
import { toast } from 'sonner';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonContactForm from './PersonContactForm';
import PersonSocialForm from './PersonSocialForm';
import PersonEducationHistorySection from './PersonEducationHistorySection';
import PersonEmploymentHistorySection from './PersonEmploymentHistorySection';
import {
  useCreatePersonContact,
  useCreatePersonSocial,
  useDeletePersonContact,
  useDeletePersonSocial,
  usePerson,
  usePersonContacts,
  usePersonSocials,
  useUpdatePersonContact,
  useUpdatePersonSocial,
} from '../hooks/usePeople';
import {
  getContactTypeLabel,
  getSocialPlatformLabel,
} from '../types/person.types';
import type {
  CreatePersonContactPayload,
  CreatePersonSocialPayload,
  PersonContact,
  PersonSocial,
  UpdatePersonContactPayload,
  UpdatePersonSocialPayload,
} from '../types/person.types';

interface PersonDetailDrawerProps {
  personId: string;
  open: boolean;
  onClose: () => void;
  canManageContacts: boolean;
  canManageSocials: boolean;
  canManageHistories: boolean;
}

function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography>{value?.trim() || '—'}</Typography>
    </Box>
  );
}

export default function PersonDetailDrawer({
  personId,
  open,
  onClose,
  canManageContacts,
  canManageSocials,
  canManageHistories,
}: PersonDetailDrawerProps) {
  const personQuery = usePerson(personId);
  const contactsQuery = usePersonContacts(personId);
  const socialsQuery = usePersonSocials(personId);
  const createContact = useCreatePersonContact(personId);
  const deleteContact = useDeletePersonContact(personId);
  const createSocial = useCreatePersonSocial(personId);
  const deleteSocial = useDeletePersonSocial(personId);
  const [contactFormOpen, setContactFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<PersonContact | null>(null);
  const [deletingContact, setDeletingContact] = useState<PersonContact | null>(null);
  const [socialFormOpen, setSocialFormOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState<PersonSocial | null>(null);
  const [deletingSocial, setDeletingSocial] = useState<PersonSocial | null>(null);
  const updateContact = useUpdatePersonContact(personId, editingContact?.id ?? '');
  const updateSocial = useUpdatePersonSocial(personId, editingSocial?.id ?? '');

  const submitContact = async (
    values: CreatePersonContactPayload | UpdatePersonContactPayload,
  ) => {
    try {
      if (editingContact) {
        await updateContact.mutateAsync(values);
        toast.success('راه تماس با موفقیت بروزرسانی شد.');
      } else {
        await createContact.mutateAsync(values as CreatePersonContactPayload);
        toast.success('راه تماس با موفقیت ایجاد شد.');
      }
      setContactFormOpen(false);
      setEditingContact(null);
    } catch {
      // خطا در فرم نمایش داده می‌شود.
    }
  };

  const submitSocial = async (
    values: CreatePersonSocialPayload | UpdatePersonSocialPayload,
  ) => {
    try {
      if (editingSocial) {
        await updateSocial.mutateAsync(values);
        toast.success('شبکه اجتماعی با موفقیت بروزرسانی شد.');
      } else {
        await createSocial.mutateAsync(values as CreatePersonSocialPayload);
        toast.success('شبکه اجتماعی با موفقیت ایجاد شد.');
      }
      setSocialFormOpen(false);
      setEditingSocial(null);
    } catch {
      // خطا در فرم نمایش داده می‌شود.
    }
  };

  const confirmDeleteContact = async () => {
    if (!deletingContact) return;
    try {
      await deleteContact.mutateAsync(deletingContact.id);
      toast.success('راه تماس با موفقیت حذف شد.');
      setDeletingContact(null);
    } catch {
      toast.error('خطا در حذف راه تماس.');
    }
  };

  const confirmDeleteSocial = async () => {
    if (!deletingSocial) return;
    try {
      await deleteSocial.mutateAsync(deletingSocial.id);
      toast.success('شبکه اجتماعی با موفقیت حذف شد.');
      setDeletingSocial(null);
    } catch {
      toast.error('خطا در حذف شبکه اجتماعی.');
    }
  };

  const contactMutation = editingContact ? updateContact : createContact;
  const socialMutation = editingSocial ? updateSocial : createSocial;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: { xs: '100%', sm: 560 }, maxWidth: '100%' } } }}
    >
      <Stack direction="row" sx={{ p: 2, alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">جزئیات شخص</Typography>
        <IconButton onClick={onClose} aria-label="بستن"><CloseIcon /></IconButton>
      </Stack>
      <Divider />

      <Box sx={{ p: 2, overflowY: 'auto' }}>
        {personQuery.isLoading ? (
          <Stack sx={{ py: 8, alignItems: 'center' }}><CircularProgress /></Stack>
        ) : personQuery.isError || !personQuery.data ? (
          <Alert severity="error">خطا در دریافت اطلاعات شخص.</Alert>
        ) : (
          <Stack spacing={3}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>اطلاعات شخص</Typography>
              <Stack spacing={1.5}>
                <Info label="نام کامل" value={personQuery.data.fullName} />
                <Info label="دپارتمان" value={personQuery.data.department} />
                <Info label="سمت سازمانی" value={personQuery.data.jobTitle ?? personQuery.data.title} />
                <Info label="نقش در فرآیند فروش" value={personQuery.data.personaRole ?? personQuery.data.personaTag} />
                <Info label="سطح ارشدیت" value={personQuery.data.seniorityLevel} />
                {/* <Info label="لینکدین" value={personQuery.data.linkedinUrl} />
                <Info label="ایمیل" value={personQuery.data.email} />
                <Info label="تلفن" value={personQuery.data.phone} /> */}
                {/* <Alert severity="info">
                  راه‌های تماس و شبکه‌های اجتماعی از بخش‌های جداگانه پایین همین پنل مدیریت می‌شوند.
                </Alert> */}
                <Info label="مخاطب اصلی" value={personQuery.data.isPrimaryContact ? 'بله' : 'خیر'} />
                <Info label="مخاطب دوم" value={personQuery.data.isSecondaryContact ? 'بله' : 'خیر'} />
              </Stack>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2 }}>
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">راه‌های تماس</Typography>
                {canManageContacts && (
                  <Button size="small" onClick={() => { setEditingContact(null); setContactFormOpen(true); }}>
                    افزودن راه تماس
                  </Button>
                )}
              </Stack>
              {contactsQuery.isLoading ? <Typography>در حال دریافت...</Typography>
                : contactsQuery.isError ? <Alert severity="error">خطا در دریافت راه‌های تماس.</Alert>
                  : !contactsQuery.data?.length ? <Typography color="text.secondary">هنوز راه تماسی برای این شخص ثبت نشده است.</Typography>
                    : <Stack spacing={1}>{contactsQuery.data.map((contact) => (
                      <Paper key={contact.id} variant="outlined" sx={{ p: 1.5 }}>
                        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                              <Typography sx={{ fontWeight: 600 }}>{getContactTypeLabel(contact.type)}</Typography>
                              {contact.isPrimary && <Chip size="small" label="اصلی" color="primary" />}
                            </Stack>
                            <Typography>{contact.value}</Typography>
                            {contact.note && <Typography variant="body2" color="text.secondary">{contact.note}</Typography>}
                          </Box>
                          {canManageContacts && <Box>
                            <IconButton size="small" onClick={() => { setEditingContact(contact); setContactFormOpen(true); }}><EditIcon /></IconButton>
                            <IconButton size="small" color="error" onClick={() => setDeletingContact(contact)}><DeleteIcon /></IconButton>
                          </Box>}
                        </Stack>
                      </Paper>
                    ))}</Stack>}
            </Paper>

            <Paper variant="outlined" sx={{ p: 2 }}>
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">شبکه‌های اجتماعی</Typography>
                {canManageSocials && (
                  <Button size="small" onClick={() => { setEditingSocial(null); setSocialFormOpen(true); }}>
                    افزودن شبکه اجتماعی
                  </Button>
                )}
              </Stack>
              {socialsQuery.isLoading ? <Typography>در حال دریافت...</Typography>
                : socialsQuery.isError ? <Alert severity="error">خطا در دریافت شبکه‌های اجتماعی.</Alert>
                  : !socialsQuery.data?.length ? <Typography color="text.secondary">هنوز شبکه اجتماعی برای این شخص ثبت نشده است.</Typography>
                    : <Stack spacing={1}>{socialsQuery.data.map((social) => (
                      <Paper key={social.id} variant="outlined" sx={{ p: 1.5 }}>
                        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                              <Typography sx={{ fontWeight: 600 }}>{getSocialPlatformLabel(social.platform)}</Typography>
                              {social.isPrimary && <Chip size="small" label="اصلی" color="primary" />}
                            </Stack>
                            <Typography sx={{ overflowWrap: 'anywhere' }}>{social.handle}</Typography>
                            {social.note && <Typography variant="body2" color="text.secondary">{social.note}</Typography>}
                          </Box>
                          {canManageSocials && <Box>
                            <IconButton size="small" onClick={() => { setEditingSocial(social); setSocialFormOpen(true); }}><EditIcon /></IconButton>
                            <IconButton size="small" color="error" onClick={() => setDeletingSocial(social)}><DeleteIcon /></IconButton>
                          </Box>}
                        </Stack>
                      </Paper>
                    ))}</Stack>}
            </Paper>

            <PersonEmploymentHistorySection personId={personId} canManage={canManageHistories} />
            <PersonEducationHistorySection personId={personId} canManage={canManageHistories} />
          </Stack>
        )}
      </Box>

      <Dialog open={contactFormOpen} onClose={() => setContactFormOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>{editingContact ? 'ویرایش راه تماس' : 'افزودن راه تماس'}</DialogTitle>
        <DialogContent>
          <PersonContactForm
            mode={editingContact ? 'edit' : 'create'}
            initialValues={editingContact ?? undefined}
            isSubmitting={contactMutation.isPending}
            errorMessage={contactMutation.isError
              ? editingContact ? 'خطا در بروزرسانی راه تماس.' : 'خطا در ایجاد راه تماس.'
              : undefined}
            onSubmit={submitContact}
            onCancel={() => setContactFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={socialFormOpen} onClose={() => setSocialFormOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>{editingSocial ? 'ویرایش شبکه اجتماعی' : 'افزودن شبکه اجتماعی'}</DialogTitle>
        <DialogContent>
          <PersonSocialForm
            mode={editingSocial ? 'edit' : 'create'}
            initialValues={editingSocial ?? undefined}
            isSubmitting={socialMutation.isPending}
            errorMessage={socialMutation.isError
              ? editingSocial ? 'خطا در بروزرسانی شبکه اجتماعی.' : 'خطا در ایجاد شبکه اجتماعی.'
              : undefined}
            onSubmit={submitSocial}
            onCancel={() => setSocialFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deletingContact)} onClose={() => setDeletingContact(null)}>
        <DialogTitle>حذف راه تماس</DialogTitle>
        <DialogContent><Typography>آیا از حذف این راه تماس مطمئن هستید؟</Typography></DialogContent>
        <Stack direction="row" spacing={1} sx={{ p: 2, justifyContent: 'flex-end' }}>
          <Button onClick={() => setDeletingContact(null)}>انصراف</Button>
          <Button color="error" variant="contained" onClick={confirmDeleteContact} disabled={deleteContact.isPending}>حذف</Button>
        </Stack>
      </Dialog>

      <Dialog open={Boolean(deletingSocial)} onClose={() => setDeletingSocial(null)}>
        <DialogTitle>حذف شبکه اجتماعی</DialogTitle>
        <DialogContent><Typography>آیا از حذف این شبکه اجتماعی مطمئن هستید؟</Typography></DialogContent>
        <Stack direction="row" spacing={1} sx={{ p: 2, justifyContent: 'flex-end' }}>
          <Button onClick={() => setDeletingSocial(null)}>انصراف</Button>
          <Button color="error" variant="contained" onClick={confirmDeleteSocial} disabled={deleteSocial.isPending}>حذف</Button>
        </Stack>
      </Dialog>
    </Drawer>
  );
}
