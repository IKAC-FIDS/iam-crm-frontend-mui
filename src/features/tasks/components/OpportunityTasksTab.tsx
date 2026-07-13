import TasksTable from './TasksTable';

export default function OpportunityTasksTab({
  opportunityId,
  opportunityTitle,
  companyId,
  companyName,
}: {
  opportunityId: string;
  opportunityTitle?: string;
  companyId?: string;
  companyName?: string;
}) {
  return (
    <TasksTable
      fixedParams={{ opportunityId }}
      contextOpportunityId={opportunityId}
      contextOpportunityTitle={opportunityTitle}
      contextCompanyId={companyId}
      contextCompanyName={companyName}
      lockOpportunity
      lockCompany
      compact
    />
  );
}
