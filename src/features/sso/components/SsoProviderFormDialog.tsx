import { useState } from 'react';
import { toast } from 'sonner';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';
import { getApiErrorMessage } from '@/lib/apiResponse';
import { useCreateSsoProvider, useUpdateSsoProvider } from '../hooks/useSsoProviders';
import { ssoDefaultRoles, type CreateSsoProviderPayload, type SsoDefaultRole, type SsoProvider, type SsoProviderType } from '../types/sso.types';
import { joinCommaList, splitCommaList, ssoProviderTypeOptions } from '../utils/ssoDisplay';
import SsoProviderSecretWarning from './SsoProviderSecretWarning';

export default function SsoProviderFormDialog({
  provider,
  open,
  onClose,
}: {
  provider?: SsoProvider | null;
  open: boolean;
  onClose: () => void;
}) {
  const create = useCreateSsoProvider();
  const update = useUpdateSsoProvider();
  const [type, setType] = useState<SsoProviderType>(provider?.type ?? 'OIDC');
  const [name, setName] = useState(provider?.name ?? '');
  const [isActive, setIsActive] = useState(provider?.isActive ?? true);
  const [autoProvision, setAutoProvision] = useState(provider?.autoProvision ?? false);
  const [defaultRole, setDefaultRole] = useState<SsoDefaultRole | ''>(provider?.defaultRole ?? '');
  const [allowedDomains, setAllowedDomains] = useState(joinCommaList(provider?.allowedDomains));
  const [issuer, setIssuer] = useState(provider?.issuer ?? '');
  const [clientId, setClientId] = useState(provider?.clientId ?? '');
  const [clientSecret, setClientSecret] = useState('');
  const [authorizationUrl, setAuthorizationUrl] = useState(provider?.authorizationUrl ?? '');
  const [tokenUrl, setTokenUrl] = useState(provider?.tokenUrl ?? '');
  const [userInfoUrl, setUserInfoUrl] = useState(provider?.userInfoUrl ?? '');
  const [jwksUrl, setJwksUrl] = useState(provider?.jwksUrl ?? '');
  const [scopes, setScopes] = useState(joinCommaList(provider?.scopes) || 'openid, profile, email');
  const [entityId, setEntityId] = useState(provider?.entityId ?? '');
  const [ssoUrl, setSsoUrl] = useState(provider?.ssoUrl ?? '');
  const [x509Certificate, setX509Certificate] = useState('');
  const [signRequests, setSignRequests] = useState(provider?.signRequests ?? false);
  const [wantAssertionsSigned, setWantAssertionsSigned] = useState(provider?.wantAssertionsSigned ?? true);
  const [wantResponseSigned, setWantResponseSigned] = useState(provider?.wantResponseSigned ?? false);
  const [emailAttribute, setEmailAttribute] = useState(provider?.emailAttribute ?? '');
  const [nameAttribute, setNameAttribute] = useState(provider?.nameAttribute ?? '');
  const [groupsAttribute, setGroupsAttribute] = useState(provider?.groupsAttribute ?? '');
  const pending = create.isPending || update.isPending;

  const payload = (): CreateSsoProviderPayload => {
    const base: CreateSsoProviderPayload = {
      name: name.trim(),
      type,
      isActive,
      autoProvision,
      defaultRole: defaultRole || undefined,
      allowedDomains: splitCommaList(allowedDomains),
      emailAttribute: emailAttribute.trim() || undefined,
      nameAttribute: nameAttribute.trim() || undefined,
      groupsAttribute: groupsAttribute.trim() || undefined,
    };

    if (type === 'OIDC') {
      return {
        ...base,
        issuer: issuer.trim() || undefined,
        clientId: clientId.trim() || undefined,
        clientSecret: clientSecret.trim() || undefined,
        authorizationUrl: authorizationUrl.trim() || undefined,
        tokenUrl: tokenUrl.trim() || undefined,
        userInfoUrl: userInfoUrl.trim() || undefined,
        jwksUrl: jwksUrl.trim() || undefined,
        scopes: splitCommaList(scopes),
      };
    }

    return {
      ...base,
      entityId: entityId.trim() || undefined,
      ssoUrl: ssoUrl.trim() || undefined,
      x509Certificate: x509Certificate.trim() || undefined,
      signRequests,
      wantAssertionsSigned,
      wantResponseSigned,
    };
  };

  const submit = async () => {
    try {
      if (provider) await update.mutateAsync({ id: provider.id, payload: payload() });
      else await create.mutateAsync(payload());
      toast.success(provider ? 'ارائه‌دهنده بروزرسانی شد.' : 'ارائه‌دهنده ایجاد شد.');
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'ذخیره ارائه‌دهنده ورود سازمانی انجام نشد.'));
    }
  };

  return (
    <Dialog open={open} onClose={() => !pending && onClose()} fullWidth maxWidth="md">
      <DialogTitle>{provider ? 'ویرایش ارائه‌دهنده ورود سازمانی' : 'ایجاد ارائه‌دهنده ورود سازمانی'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <SsoProviderSecretWarning />
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField fullWidth select label="نوع" value={type} onChange={(event) => setType(event.target.value as SsoProviderType)}>
              {ssoProviderTypeOptions.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}
            </TextField>
            <TextField fullWidth required label="نام" value={name} onChange={(event) => setName(event.target.value)} />
          </Stack>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField fullWidth label="دامنه‌های مجاز" value={allowedDomains} onChange={(event) => setAllowedDomains(event.target.value)} helperText="با ویرگول جدا کنید." />
            <TextField fullWidth select label="نقش پیش‌فرض" value={defaultRole} onChange={(event) => setDefaultRole(event.target.value as SsoDefaultRole | '')}>
              <MenuItem value="">بدون نقش پیش‌فرض</MenuItem>
              {ssoDefaultRoles.map((role) => <MenuItem key={role} value={role}>{role}</MenuItem>)}
            </TextField>
          </Stack>
          <Stack direction="row" spacing={2}>
            <FormControlLabel control={<Checkbox checked={isActive} onChange={(event) => setIsActive(event.target.checked)} />} label="فعال" />
            <FormControlLabel control={<Checkbox checked={autoProvision} onChange={(event) => setAutoProvision(event.target.checked)} />} label="ایجاد خودکار کاربر" />
          </Stack>
          {type === 'OIDC' ? (
            <>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField fullWidth label="Issuer" value={issuer} onChange={(event) => setIssuer(event.target.value)} />
                <TextField fullWidth label="Client ID" value={clientId} onChange={(event) => setClientId(event.target.value)} />
              </Stack>
              <TextField label={provider?.hasClientSecret ? 'Client Secret جدید' : 'Client Secret'} type="password" value={clientSecret} onChange={(event) => setClientSecret(event.target.value)} helperText={provider?.hasClientSecret ? 'رمز فعلی ذخیره شده اما نمایش داده نمی‌شود.' : undefined} />
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField fullWidth label="Authorization URL" value={authorizationUrl} onChange={(event) => setAuthorizationUrl(event.target.value)} />
                <TextField fullWidth label="Token URL" value={tokenUrl} onChange={(event) => setTokenUrl(event.target.value)} />
              </Stack>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField fullWidth label="UserInfo URL" value={userInfoUrl} onChange={(event) => setUserInfoUrl(event.target.value)} />
                <TextField fullWidth label="JWKS URL" value={jwksUrl} onChange={(event) => setJwksUrl(event.target.value)} />
              </Stack>
              <TextField label="Scopes" value={scopes} onChange={(event) => setScopes(event.target.value)} helperText="با ویرگول جدا کنید؛ openid باید وجود داشته باشد." />
            </>
          ) : (
            <>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField fullWidth label="Entity ID" value={entityId} onChange={(event) => setEntityId(event.target.value)} />
                <TextField fullWidth label="SSO URL" value={ssoUrl} onChange={(event) => setSsoUrl(event.target.value)} />
              </Stack>
              <TextField label="X.509 Certificate" multiline minRows={5} value={x509Certificate} onChange={(event) => setX509Certificate(event.target.value)} helperText={provider?.x509Certificate ? 'گواهی فعلی نمایش داده نمی‌شود؛ فقط مقدار جدید ارسال می‌شود.' : undefined} />
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
                <FormControlLabel control={<Checkbox checked={signRequests} onChange={(event) => setSignRequests(event.target.checked)} />} label="امضای درخواست‌ها" />
                <FormControlLabel control={<Checkbox checked={wantAssertionsSigned} onChange={(event) => setWantAssertionsSigned(event.target.checked)} />} label="Assertion امضاشده" />
                <FormControlLabel control={<Checkbox checked={wantResponseSigned} onChange={(event) => setWantResponseSigned(event.target.checked)} />} label="Response امضاشده" />
              </Stack>
            </>
          )}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField fullWidth label="ویژگی ایمیل" value={emailAttribute} onChange={(event) => setEmailAttribute(event.target.value)} />
            <TextField fullWidth label="ویژگی نام" value={nameAttribute} onChange={(event) => setNameAttribute(event.target.value)} />
            <TextField fullWidth label="ویژگی گروه‌ها" value={groupsAttribute} onChange={(event) => setGroupsAttribute(event.target.value)} />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={pending}>انصراف</Button>
        <Button variant="contained" onClick={submit} disabled={!name.trim() || pending}>ذخیره</Button>
      </DialogActions>
    </Dialog>
  );
}
