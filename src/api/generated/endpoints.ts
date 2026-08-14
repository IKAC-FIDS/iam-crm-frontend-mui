/**
 * AUTO-GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 * Source: contracts/backend/openapi.json.
 */
import type {
  ArchiveCompanyDto,
  AssignTaskDto,
  BulkChangeOwnerDto,
  ChangeOwnerDto,
  ChangeTaskStatusDto,
  CompaniesArchivePatch200,
  CompaniesBranchesDelete200,
  CompaniesBranchesGet200,
  CompaniesBranchesGet2200,
  CompaniesBranchesPatch200,
  CompaniesBranchesPost201,
  CompaniesBulkOwnerPatch200,
  CompaniesCallCardGet200,
  CompaniesCallCardPut200,
  CompaniesCallCardSuggestGet200,
  CompaniesGet1200,
  CompaniesGet200,
  CompaniesGetParams,
  CompaniesLegalDocumentsDelete200,
  CompaniesLegalDocumentsGet200,
  CompaniesLegalDocumentsPatch200,
  CompaniesLegalDocumentsUploadPost201,
  CompaniesOpportunitiesGet200,
  CompaniesOpportunitiesGetParams,
  CompaniesOpportunitiesPost201,
  CompaniesOptionsGet200,
  CompaniesOptionsGet2200,
  CompaniesOptionsGetParams,
  CompaniesOwnerPatch200,
  CompaniesPatch200,
  CompaniesPost201,
  CompaniesRestorePatch200,
  CompaniesSocialChannelsDelete200,
  CompaniesSocialChannelsGet200,
  CompaniesSocialChannelsGet2200,
  CompaniesSocialChannelsPatch200,
  CompaniesSocialChannelsPost201,
  CompaniesStagePatch200,
  CompleteTaskDto,
  CreateCompanyBranchDto,
  CreateCompanyDto,
  CreateCompanyOpportunityDto,
  CreateCompanySocialChannelDto,
  CreateTaskDto,
  RescheduleTaskDto,
  TasksAssignPatch200,
  TasksCompletePatch200,
  TasksDelete200,
  TasksGet1200,
  TasksGet200,
  TasksGetParams,
  TasksPatch200,
  TasksPost201,
  TasksReschedulePatch200,
  TasksStatusPatch200,
  UpdateCompanyBranchDto,
  UpdateCompanyDto,
  UpdateCompanyLegalDocumentDto,
  UpdateCompanySocialChannelDto,
  UpdateTaskDto,
  UploadCompanyLegalDocumentDto,
  UpsertCallCardDto
} from './models';

import { generatedApiMutator } from '../generatedApiMutator';


type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];


  /**
 * Tenant-scoped operations derive Organization from trusted TenantContext; clients cannot override it.
 */
export const companiesGet = (
    params?: CompaniesGetParams,
 options?: SecondParameter<typeof generatedApiMutator<CompaniesGet200>>,) => {
      return generatedApiMutator<CompaniesGet200>(
      {url: `/api/companies`, method: 'GET',
        params
    },
      options);
    }

/**
 * Tenant-scoped operations derive Organization from trusted TenantContext; clients cannot override it.
 */
export const companiesPost = (
    createCompanyDto: CreateCompanyDto,
 options?: SecondParameter<typeof generatedApiMutator<CompaniesPost201>>,) => {
      return generatedApiMutator<CompaniesPost201>(
      {url: `/api/companies`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: createCompanyDto
    },
      options);
    }

/**
 * Tenant-scoped operations derive Organization from trusted TenantContext; clients cannot override it.
 */
export const companiesBranchesGet = (
    companyId: string,
 options?: SecondParameter<typeof generatedApiMutator<CompaniesBranchesGet200>>,) => {
      return generatedApiMutator<CompaniesBranchesGet200>(
      {url: `/api/companies/${companyId}/branches`, method: 'GET'
    },
      options);
    }

/**
 * Tenant-scoped operations derive Organization from trusted TenantContext; clients cannot override it.
 */
export const companiesBranchesPost = (
    companyId: string,
    createCompanyBranchDto: CreateCompanyBranchDto,
 options?: SecondParameter<typeof generatedApiMutator<CompaniesBranchesPost201>>,) => {
      return generatedApiMutator<CompaniesBranchesPost201>(
      {url: `/api/companies/${companyId}/branches`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: createCompanyBranchDto
    },
      options);
    }

/**
 * Tenant-scoped operations derive Organization from trusted TenantContext; clients cannot override it.
 */
export const companiesBranchesDelete = (
    companyId: string,
    id: string,
 options?: SecondParameter<typeof generatedApiMutator<CompaniesBranchesDelete200>>,) => {
      return generatedApiMutator<CompaniesBranchesDelete200>(
      {url: `/api/companies/${companyId}/branches/${id}`, method: 'DELETE'
    },
      options);
    }

/**
 * Tenant-scoped operations derive Organization from trusted TenantContext; clients cannot override it.
 */
export const companiesBranchesGet2 = (
    companyId: string,
    id: string,
 options?: SecondParameter<typeof generatedApiMutator<CompaniesBranchesGet2200>>,) => {
      return generatedApiMutator<CompaniesBranchesGet2200>(
      {url: `/api/companies/${companyId}/branches/${id}`, method: 'GET'
    },
      options);
    }

/**
 * Tenant-scoped operations derive Organization from trusted TenantContext; clients cannot override it.
 */
export const companiesBranchesPatch = (
    companyId: string,
    id: string,
    updateCompanyBranchDto: UpdateCompanyBranchDto,
 options?: SecondParameter<typeof generatedApiMutator<CompaniesBranchesPatch200>>,) => {
      return generatedApiMutator<CompaniesBranchesPatch200>(
      {url: `/api/companies/${companyId}/branches/${id}`, method: 'PATCH',
      headers: {'Content-Type': 'application/json', },
      data: updateCompanyBranchDto
    },
      options);
    }

/**
 * Tenant-scoped operations derive Organization from trusted TenantContext; clients cannot override it.
 */
export const companiesCallCardGet = (
    companyId: string,
 options?: SecondParameter<typeof generatedApiMutator<CompaniesCallCardGet200>>,) => {
      return generatedApiMutator<CompaniesCallCardGet200>(
      {url: `/api/companies/${companyId}/call-card`, method: 'GET'
    },
      options);
    }

/**
 * Tenant-scoped operations derive Organization from trusted TenantContext; clients cannot override it.
 */
export const companiesCallCardPut = (
    companyId: string,
    upsertCallCardDto: UpsertCallCardDto,
 options?: SecondParameter<typeof generatedApiMutator<CompaniesCallCardPut200>>,) => {
      return generatedApiMutator<CompaniesCallCardPut200>(
      {url: `/api/companies/${companyId}/call-card`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: upsertCallCardDto
    },
      options);
    }

/**
 * Tenant-scoped operations derive Organization from trusted TenantContext; clients cannot override it.
 */
export const companiesCallCardSuggestGet = (
    companyId: string,
 options?: SecondParameter<typeof generatedApiMutator<CompaniesCallCardSuggestGet200>>,) => {
      return generatedApiMutator<CompaniesCallCardSuggestGet200>(
      {url: `/api/companies/${companyId}/call-card/suggest`, method: 'GET'
    },
      options);
    }

/**
 * Tenant-scoped operations derive Organization from trusted TenantContext; clients cannot override it.
 */
export const companiesLegalDocumentsGet = (
    companyId: string,
 options?: SecondParameter<typeof generatedApiMutator<CompaniesLegalDocumentsGet200>>,) => {
      return generatedApiMutator<CompaniesLegalDocumentsGet200>(
      {url: `/api/companies/${companyId}/legal-documents`, method: 'GET'
    },
      options);
    }

/**
 * Tenant-scoped operations derive Organization from trusted TenantContext; clients cannot override it.
 */
export const companiesLegalDocumentsDelete = (
    companyId: string,
    documentId: string,
 options?: SecondParameter<typeof generatedApiMutator<CompaniesLegalDocumentsDelete200>>,) => {
      return generatedApiMutator<CompaniesLegalDocumentsDelete200>(
      {url: `/api/companies/${companyId}/legal-documents/${documentId}`, method: 'DELETE'
    },
      options);
    }

/**
 * Tenant-scoped operations derive Organization from trusted TenantContext; clients cannot override it.
 */
export const companiesLegalDocumentsPatch = (
    companyId: string,
    documentId: string,
    updateCompanyLegalDocumentDto: UpdateCompanyLegalDocumentDto,
 options?: SecondParameter<typeof generatedApiMutator<CompaniesLegalDocumentsPatch200>>,) => {
      return generatedApiMutator<CompaniesLegalDocumentsPatch200>(
      {url: `/api/companies/${companyId}/legal-documents/${documentId}`, method: 'PATCH',
      headers: {'Content-Type': 'application/json', },
      data: updateCompanyLegalDocumentDto
    },
      options);
    }

/**
 * Tenant-scoped operations derive Organization from trusted TenantContext; clients cannot override it.
 */
export const companiesLegalDocumentsUploadPost = (
    companyId: string,
    uploadCompanyLegalDocumentDto: UploadCompanyLegalDocumentDto,
 options?: SecondParameter<typeof generatedApiMutator<CompaniesLegalDocumentsUploadPost201>>,) => {
      return generatedApiMutator<CompaniesLegalDocumentsUploadPost201>(
      {url: `/api/companies/${companyId}/legal-documents/upload`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: uploadCompanyLegalDocumentDto
    },
      options);
    }

/**
 * Tenant-scoped operations derive Organization from trusted TenantContext; clients cannot override it.
 */
export const companiesOpportunitiesGet = (
    companyId: string,
    params?: CompaniesOpportunitiesGetParams,
 options?: SecondParameter<typeof generatedApiMutator<CompaniesOpportunitiesGet200>>,) => {
      return generatedApiMutator<CompaniesOpportunitiesGet200>(
      {url: `/api/companies/${companyId}/opportunities`, method: 'GET',
        params
    },
      options);
    }

/**
 * Tenant-scoped operations derive Organization from trusted TenantContext; clients cannot override it.
 */
export const companiesOpportunitiesPost = (
    companyId: string,
    createCompanyOpportunityDto: CreateCompanyOpportunityDto,
 options?: SecondParameter<typeof generatedApiMutator<CompaniesOpportunitiesPost201>>,) => {
      return generatedApiMutator<CompaniesOpportunitiesPost201>(
      {url: `/api/companies/${companyId}/opportunities`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: createCompanyOpportunityDto
    },
      options);
    }

/**
 * Tenant-scoped operations derive Organization from trusted TenantContext; clients cannot override it.
 */
export const companiesSocialChannelsGet = (
    companyId: string,
 options?: SecondParameter<typeof generatedApiMutator<CompaniesSocialChannelsGet200>>,) => {
      return generatedApiMutator<CompaniesSocialChannelsGet200>(
      {url: `/api/companies/${companyId}/social-channels`, method: 'GET'
    },
      options);
    }

/**
 * Tenant-scoped operations derive Organization from trusted TenantContext; clients cannot override it.
 */
export const companiesSocialChannelsPost = (
    companyId: string,
    createCompanySocialChannelDto: CreateCompanySocialChannelDto,
 options?: SecondParameter<typeof generatedApiMutator<CompaniesSocialChannelsPost201>>,) => {
      return generatedApiMutator<CompaniesSocialChannelsPost201>(
      {url: `/api/companies/${companyId}/social-channels`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: createCompanySocialChannelDto
    },
      options);
    }

/**
 * Tenant-scoped operations derive Organization from trusted TenantContext; clients cannot override it.
 */
export const companiesSocialChannelsDelete = (
    companyId: string,
    id: string,
 options?: SecondParameter<typeof generatedApiMutator<CompaniesSocialChannelsDelete200>>,) => {
      return generatedApiMutator<CompaniesSocialChannelsDelete200>(
      {url: `/api/companies/${companyId}/social-channels/${id}`, method: 'DELETE'
    },
      options);
    }

/**
 * Tenant-scoped operations derive Organization from trusted TenantContext; clients cannot override it.
 */
export const companiesSocialChannelsGet2 = (
    companyId: string,
    id: string,
 options?: SecondParameter<typeof generatedApiMutator<CompaniesSocialChannelsGet2200>>,) => {
      return generatedApiMutator<CompaniesSocialChannelsGet2200>(
      {url: `/api/companies/${companyId}/social-channels/${id}`, method: 'GET'
    },
      options);
    }

/**
 * Tenant-scoped operations derive Organization from trusted TenantContext; clients cannot override it.
 */
export const companiesSocialChannelsPatch = (
    companyId: string,
    id: string,
    updateCompanySocialChannelDto: UpdateCompanySocialChannelDto,
 options?: SecondParameter<typeof generatedApiMutator<CompaniesSocialChannelsPatch200>>,) => {
      return generatedApiMutator<CompaniesSocialChannelsPatch200>(
      {url: `/api/companies/${companyId}/social-channels/${id}`, method: 'PATCH',
      headers: {'Content-Type': 'application/json', },
      data: updateCompanySocialChannelDto
    },
      options);
    }

/**
 * Tenant-scoped operations derive Organization from trusted TenantContext; clients cannot override it.
 */
export const companiesGet1 = (
    id: string,
 options?: SecondParameter<typeof generatedApiMutator<CompaniesGet1200>>,) => {
      return generatedApiMutator<CompaniesGet1200>(
      {url: `/api/companies/${id}`, method: 'GET'
    },
      options);
    }

/**
 * Tenant-scoped operations derive Organization from trusted TenantContext; clients cannot override it.
 */
export const companiesPatch = (
    id: string,
    updateCompanyDto: UpdateCompanyDto,
 options?: SecondParameter<typeof generatedApiMutator<CompaniesPatch200>>,) => {
      return generatedApiMutator<CompaniesPatch200>(
      {url: `/api/companies/${id}`, method: 'PATCH',
      headers: {'Content-Type': 'application/json', },
      data: updateCompanyDto
    },
      options);
    }

/**
 * Tenant-scoped operations derive Organization from trusted TenantContext; clients cannot override it.
 */
export const companiesArchivePatch = (
    id: string,
    archiveCompanyDto: ArchiveCompanyDto,
 options?: SecondParameter<typeof generatedApiMutator<CompaniesArchivePatch200>>,) => {
      return generatedApiMutator<CompaniesArchivePatch200>(
      {url: `/api/companies/${id}/archive`, method: 'PATCH',
      headers: {'Content-Type': 'application/json', },
      data: archiveCompanyDto
    },
      options);
    }

/**
 * Tenant-scoped operations derive Organization from trusted TenantContext; clients cannot override it.
 */
export const companiesOwnerPatch = (
    id: string,
    changeOwnerDto: ChangeOwnerDto,
 options?: SecondParameter<typeof generatedApiMutator<CompaniesOwnerPatch200>>,) => {
      return generatedApiMutator<CompaniesOwnerPatch200>(
      {url: `/api/companies/${id}/owner`, method: 'PATCH',
      headers: {'Content-Type': 'application/json', },
      data: changeOwnerDto
    },
      options);
    }

/**
 * Tenant-scoped operations derive Organization from trusted TenantContext; clients cannot override it.
 */
export const companiesRestorePatch = (
    id: string,
 options?: SecondParameter<typeof generatedApiMutator<CompaniesRestorePatch200>>,) => {
      return generatedApiMutator<CompaniesRestorePatch200>(
      {url: `/api/companies/${id}/restore`, method: 'PATCH'
    },
      options);
    }

/**
 * Tenant-scoped operations derive Organization from trusted TenantContext; clients cannot override it.
 */
export const companiesStagePatch = (
    id: string,
 options?: SecondParameter<typeof generatedApiMutator<CompaniesStagePatch200>>,) => {
      return generatedApiMutator<CompaniesStagePatch200>(
      {url: `/api/companies/${id}/stage`, method: 'PATCH'
    },
      options);
    }

/**
 * Tenant-scoped operations derive Organization from trusted TenantContext; clients cannot override it.
 */
export const companiesBulkOwnerPatch = (
    bulkChangeOwnerDto: BulkChangeOwnerDto,
 options?: SecondParameter<typeof generatedApiMutator<CompaniesBulkOwnerPatch200>>,) => {
      return generatedApiMutator<CompaniesBulkOwnerPatch200>(
      {url: `/api/companies/bulk/owner`, method: 'PATCH',
      headers: {'Content-Type': 'application/json', },
      data: bulkChangeOwnerDto
    },
      options);
    }

/**
 * Tenant-scoped operations derive Organization from trusted TenantContext; clients cannot override it.
 */
export const companiesOptionsGet = (
    params?: CompaniesOptionsGetParams,
 options?: SecondParameter<typeof generatedApiMutator<CompaniesOptionsGet200>>,) => {
      return generatedApiMutator<CompaniesOptionsGet200>(
      {url: `/api/companies/options`, method: 'GET',
        params
    },
      options);
    }

/**
 * Tenant-scoped operations derive Organization from trusted TenantContext; clients cannot override it.
 */
export const companiesOptionsGet2 = (
    id: string,
 options?: SecondParameter<typeof generatedApiMutator<CompaniesOptionsGet2200>>,) => {
      return generatedApiMutator<CompaniesOptionsGet2200>(
      {url: `/api/companies/options/${id}`, method: 'GET'
    },
      options);
    }

/**
 * Tenant-scoped operations derive Organization from trusted TenantContext; clients cannot override it.
 */
export const tasksGet = (
    params?: TasksGetParams,
 options?: SecondParameter<typeof generatedApiMutator<TasksGet200>>,) => {
      return generatedApiMutator<TasksGet200>(
      {url: `/api/tasks`, method: 'GET',
        params
    },
      options);
    }

/**
 * Tenant-scoped operations derive Organization from trusted TenantContext; clients cannot override it.
 */
export const tasksPost = (
    createTaskDto: CreateTaskDto,
 options?: SecondParameter<typeof generatedApiMutator<TasksPost201>>,) => {
      return generatedApiMutator<TasksPost201>(
      {url: `/api/tasks`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: createTaskDto
    },
      options);
    }

/**
 * Tenant-scoped operations derive Organization from trusted TenantContext; clients cannot override it.
 */
export const tasksDelete = (
    id: string,
 options?: SecondParameter<typeof generatedApiMutator<TasksDelete200>>,) => {
      return generatedApiMutator<TasksDelete200>(
      {url: `/api/tasks/${id}`, method: 'DELETE'
    },
      options);
    }

/**
 * Tenant-scoped operations derive Organization from trusted TenantContext; clients cannot override it.
 */
export const tasksGet1 = (
    id: string,
 options?: SecondParameter<typeof generatedApiMutator<TasksGet1200>>,) => {
      return generatedApiMutator<TasksGet1200>(
      {url: `/api/tasks/${id}`, method: 'GET'
    },
      options);
    }

/**
 * Tenant-scoped operations derive Organization from trusted TenantContext; clients cannot override it.
 */
export const tasksPatch = (
    id: string,
    updateTaskDto: UpdateTaskDto,
 options?: SecondParameter<typeof generatedApiMutator<TasksPatch200>>,) => {
      return generatedApiMutator<TasksPatch200>(
      {url: `/api/tasks/${id}`, method: 'PATCH',
      headers: {'Content-Type': 'application/json', },
      data: updateTaskDto
    },
      options);
    }

/**
 * Tenant-scoped operations derive Organization from trusted TenantContext; clients cannot override it.
 */
export const tasksAssignPatch = (
    id: string,
    assignTaskDto: AssignTaskDto,
 options?: SecondParameter<typeof generatedApiMutator<TasksAssignPatch200>>,) => {
      return generatedApiMutator<TasksAssignPatch200>(
      {url: `/api/tasks/${id}/assign`, method: 'PATCH',
      headers: {'Content-Type': 'application/json', },
      data: assignTaskDto
    },
      options);
    }

/**
 * Tenant-scoped operations derive Organization from trusted TenantContext; clients cannot override it.
 */
export const tasksCompletePatch = (
    id: string,
    completeTaskDto: CompleteTaskDto,
 options?: SecondParameter<typeof generatedApiMutator<TasksCompletePatch200>>,) => {
      return generatedApiMutator<TasksCompletePatch200>(
      {url: `/api/tasks/${id}/complete`, method: 'PATCH',
      headers: {'Content-Type': 'application/json', },
      data: completeTaskDto
    },
      options);
    }

/**
 * Tenant-scoped operations derive Organization from trusted TenantContext; clients cannot override it.
 */
export const tasksReschedulePatch = (
    id: string,
    rescheduleTaskDto: RescheduleTaskDto,
 options?: SecondParameter<typeof generatedApiMutator<TasksReschedulePatch200>>,) => {
      return generatedApiMutator<TasksReschedulePatch200>(
      {url: `/api/tasks/${id}/reschedule`, method: 'PATCH',
      headers: {'Content-Type': 'application/json', },
      data: rescheduleTaskDto
    },
      options);
    }

/**
 * Tenant-scoped operations derive Organization from trusted TenantContext; clients cannot override it.
 */
export const tasksStatusPatch = (
    id: string,
    changeTaskStatusDto: ChangeTaskStatusDto,
 options?: SecondParameter<typeof generatedApiMutator<TasksStatusPatch200>>,) => {
      return generatedApiMutator<TasksStatusPatch200>(
      {url: `/api/tasks/${id}/status`, method: 'PATCH',
      headers: {'Content-Type': 'application/json', },
      data: changeTaskStatusDto
    },
      options);
    }

export type CompaniesGetResult = NonNullable<Awaited<ReturnType<typeof companiesGet>>>
export type CompaniesPostResult = NonNullable<Awaited<ReturnType<typeof companiesPost>>>
export type CompaniesBranchesGetResult = NonNullable<Awaited<ReturnType<typeof companiesBranchesGet>>>
export type CompaniesBranchesPostResult = NonNullable<Awaited<ReturnType<typeof companiesBranchesPost>>>
export type CompaniesBranchesDeleteResult = NonNullable<Awaited<ReturnType<typeof companiesBranchesDelete>>>
export type CompaniesBranchesGet2Result = NonNullable<Awaited<ReturnType<typeof companiesBranchesGet2>>>
export type CompaniesBranchesPatchResult = NonNullable<Awaited<ReturnType<typeof companiesBranchesPatch>>>
export type CompaniesCallCardGetResult = NonNullable<Awaited<ReturnType<typeof companiesCallCardGet>>>
export type CompaniesCallCardPutResult = NonNullable<Awaited<ReturnType<typeof companiesCallCardPut>>>
export type CompaniesCallCardSuggestGetResult = NonNullable<Awaited<ReturnType<typeof companiesCallCardSuggestGet>>>
export type CompaniesLegalDocumentsGetResult = NonNullable<Awaited<ReturnType<typeof companiesLegalDocumentsGet>>>
export type CompaniesLegalDocumentsDeleteResult = NonNullable<Awaited<ReturnType<typeof companiesLegalDocumentsDelete>>>
export type CompaniesLegalDocumentsPatchResult = NonNullable<Awaited<ReturnType<typeof companiesLegalDocumentsPatch>>>
export type CompaniesLegalDocumentsUploadPostResult = NonNullable<Awaited<ReturnType<typeof companiesLegalDocumentsUploadPost>>>
export type CompaniesOpportunitiesGetResult = NonNullable<Awaited<ReturnType<typeof companiesOpportunitiesGet>>>
export type CompaniesOpportunitiesPostResult = NonNullable<Awaited<ReturnType<typeof companiesOpportunitiesPost>>>
export type CompaniesSocialChannelsGetResult = NonNullable<Awaited<ReturnType<typeof companiesSocialChannelsGet>>>
export type CompaniesSocialChannelsPostResult = NonNullable<Awaited<ReturnType<typeof companiesSocialChannelsPost>>>
export type CompaniesSocialChannelsDeleteResult = NonNullable<Awaited<ReturnType<typeof companiesSocialChannelsDelete>>>
export type CompaniesSocialChannelsGet2Result = NonNullable<Awaited<ReturnType<typeof companiesSocialChannelsGet2>>>
export type CompaniesSocialChannelsPatchResult = NonNullable<Awaited<ReturnType<typeof companiesSocialChannelsPatch>>>
export type CompaniesGet1Result = NonNullable<Awaited<ReturnType<typeof companiesGet1>>>
export type CompaniesPatchResult = NonNullable<Awaited<ReturnType<typeof companiesPatch>>>
export type CompaniesArchivePatchResult = NonNullable<Awaited<ReturnType<typeof companiesArchivePatch>>>
export type CompaniesOwnerPatchResult = NonNullable<Awaited<ReturnType<typeof companiesOwnerPatch>>>
export type CompaniesRestorePatchResult = NonNullable<Awaited<ReturnType<typeof companiesRestorePatch>>>
export type CompaniesStagePatchResult = NonNullable<Awaited<ReturnType<typeof companiesStagePatch>>>
export type CompaniesBulkOwnerPatchResult = NonNullable<Awaited<ReturnType<typeof companiesBulkOwnerPatch>>>
export type CompaniesOptionsGetResult = NonNullable<Awaited<ReturnType<typeof companiesOptionsGet>>>
export type CompaniesOptionsGet2Result = NonNullable<Awaited<ReturnType<typeof companiesOptionsGet2>>>
export type TasksGetResult = NonNullable<Awaited<ReturnType<typeof tasksGet>>>
export type TasksPostResult = NonNullable<Awaited<ReturnType<typeof tasksPost>>>
export type TasksDeleteResult = NonNullable<Awaited<ReturnType<typeof tasksDelete>>>
export type TasksGet1Result = NonNullable<Awaited<ReturnType<typeof tasksGet1>>>
export type TasksPatchResult = NonNullable<Awaited<ReturnType<typeof tasksPatch>>>
export type TasksAssignPatchResult = NonNullable<Awaited<ReturnType<typeof tasksAssignPatch>>>
export type TasksCompletePatchResult = NonNullable<Awaited<ReturnType<typeof tasksCompletePatch>>>
export type TasksReschedulePatchResult = NonNullable<Awaited<ReturnType<typeof tasksReschedulePatch>>>
export type TasksStatusPatchResult = NonNullable<Awaited<ReturnType<typeof tasksStatusPatch>>>
