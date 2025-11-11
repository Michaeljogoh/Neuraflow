

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Client } from "./client";
import { getQueryClient, trpc } from "@/trpc/server";

export default async function Home() {

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.getUsers.queryOptions());
 
  return (
    <>
      <div className="text-red-500">Hello world</div>
      <HydrationBoundary state={dehydrate(queryClient)}>
       <Client />
      </HydrationBoundary>
    </>
  );
}

// "use client"

// import { useTRPC } from "@/trpc/client";
// import { useQuery } from "@tanstack/react-query";

// export default function Home() {
//     const trpc = useTRPC();

//     const { data: user } = useQuery(trpc.getUsers.queryOptions())

//   return (
//     <>
//       <div className="text-red-500">Hello world</div>
//         {JSON.stringify(user)}
//     </>
//   );
// }
