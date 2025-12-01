"use client"


import { LoadingView } from "@/components/entity-components/entity-components"
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflow"


export const EditorLoading = () =>{
    return <LoadingView message="Loading editor..." />
}

export const EditorError = () =>{
    return <LoadingView message="Error loading editor" />
}



export const Editor = ({ workflowId }: { workflowId: string }) => {
    const { data: workflow } = useSuspenseWorkflow(workflowId)

    return (
      <p>
        {JSON.stringify(workflow, null, 2)}
      </p>
    )

}