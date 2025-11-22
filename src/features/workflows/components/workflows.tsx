"use client";

import {
  EntityHeader,
  EntitySearch,
  EntityContainer,
  EntityPagination,
} from "@/components/entity-components/entity-components";
import { useCreateWorkflow, useSuspenseWorkflows } from "../hooks/use-workflow";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import { useWorkflowParams } from "../hooks/use-workflow-params";
import { useEntitySearch } from "../hooks/use-entity-search";

export const WorkflowSearch = () => {
  const [params, setParams] = useWorkflowParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });

  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search Workflows"
    />
  );
};

export const WorkflowsList = () => {
  const workflows = useSuspenseWorkflows();
  return <p>{JSON.stringify(workflows.data, null, 2)}</p>;
};

export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {
  const createworkflow = useCreateWorkflow();
  const router = useRouter();
  const { handleError, modal } = useUpgradeModal();

  const handleCreate = () => {
    createworkflow.mutate(undefined, {
      onSuccess: (data) => {
        router.push(`/workflows/${data.id}`);
      },
      onError: (error) => {
        handleError(error);
      },
    });
  };
  return (
    <>
      {modal}
      <EntityHeader
        title="Workflows"
        description="Create and manage your workflows"
        onNew={handleCreate}
        newButtonLabel="New Workflow"
        disabled={disabled}
        isCreating={createworkflow.isPending}
      />
    </>
  );
};

export const WorkflowsPagination = () =>{
  const workflows = useSuspenseWorkflows();
  const [params, setParams] = useWorkflowParams();

  return (
    <EntityPagination 
    disabled = {workflows.isFetching}
    totalPages = {workflows.data.totalPages}
    page = {workflows.data.page }
    onPageChange={(page) => setParams({ ...params, page })}
    
    />
  )
}

export const WorkflowContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<WorkflowsHeader />}
      search={<WorkflowSearch />}
      pagination={<WorkflowsPagination /> }
    >
      {children}
    </EntityContainer>
  );
};
