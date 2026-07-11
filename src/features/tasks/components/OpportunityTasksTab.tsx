import TasksTable from './TasksTable';

export default function OpportunityTasksTab({ opportunityId }: { opportunityId: string }) {
  return <TasksTable fixedParams={{ opportunityId }} opportunityId={opportunityId} compact />;
}
