import TasksTable from './TasksTable';

export default function CompanyTasksTab({ companyId, companyName }: { companyId: string; companyName?: string }) {
  return (
    <TasksTable
      fixedParams={{ companyId }}
      contextCompanyId={companyId}
      contextCompanyName={companyName}
      lockCompany
      compact
    />
  );
}
