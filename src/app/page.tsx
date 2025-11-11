
import prisma from "@/lib/db";

export default async function Home() {
  const user = await prisma.user.findMany()
  return (
    <>
      <div className="text-red-500">Hello world</div>
        {JSON.stringify(user)}
    </>
  );
}
