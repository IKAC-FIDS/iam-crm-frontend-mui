export interface CompanyBranch {
  id: string;
  companyId: string;
  name?: string | null;
  city?: string | null;
  address?: string | null;
  phone?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCompanyBranchPayload {
  name?: string;
  city?: string;
  address?: string;
  phone?: string;
}

export type UpdateCompanyBranchPayload = Partial<CreateCompanyBranchPayload>;
