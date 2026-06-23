"use client";

import {
  EntityHeader,
  EntitySearch,
  EntityContainer,
  EntityPagination,
  LoadingView,
  LoadingError,
  EmptyView,
  EntityList,
  EntityItem
} from "@/components/entity-components/entity-components";
import { useCreateWorkflow, useSuspenseWorkflows, useRemoveWorkflow  } from "../hooks/use-workflow";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import { useWorkflowParams } from "../hooks/use-workflow-params";
import { useEntitySearch } from "../hooks/use-entity-search";
import  type { Workflow } from "@/generated/prisma/client";
import { WorkflowIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";




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

  return (
    <EntityList
      items={workflows.data.items}
      getKey={(workflow) => workflow.id}
      renderItems={(workflow) => <WorkflowItems data={workflow} />}
      emptyview={<WorflowEmpty />} className={""} />
  )
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

export const WorkflowsPagination = () => {
  const workflows = useSuspenseWorkflows();
  const [params, setParams] = useWorkflowParams();

  return (
    <EntityPagination
      disabled={workflows.isFetching}
      totalPages={workflows.data.totalPages}
      page={workflows.data.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export const WorkflowLoading = () => {
  return <LoadingView message="Loading Workflows..." />;
};
export const WorkflowError = () => {
  return <LoadingError message="Error Loading Workflows" />;
};

export const WorflowEmpty = () => {
  const createWorkflow = useCreateWorkflow();
  const { handleError, modal } = useUpgradeModal();

  const handleCreate = () => {
    createWorkflow.mutate(undefined, {
      onError: (error) => {
        handleError(error);
      },
    });
  };

  return (
    <>
      {modal}
      <EmptyView
        onNew={handleCreate}
        message="Workflow not found"
      />
    </>
  );
};

export const WorkflowItems = ({ data }: { data: Workflow }) =>{ 
   
  const removeWorkflow = useRemoveWorkflow()

  const handleRemove = () =>{
    removeWorkflow.mutate({ id: data.id })
  }


  return (
    <EntityItem
    href={`/workflows/${data.id}`}
    title={data.name}
    subtitle={
      <>
        Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true})}{" "}
        &bull; Created{" "}
        {formatDistanceToNow(data.createdAt, { addSuffix: true })}
      </>
    }
    image={
      <div className="size-8 flex items-center justify-center ">
        <WorkflowIcon className="size-5 text-muted-foreground" />
      </div>
    }
    onRemove={handleRemove}
    isRemoving={removeWorkflow.isPending}
    
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
      pagination={<WorkflowsPagination />}
    >
      {children}
    </EntityContainer>
  );
};
