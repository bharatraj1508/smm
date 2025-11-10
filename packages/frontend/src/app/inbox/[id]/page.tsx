import ViewMail from "@/containers/Inbox/ViewMail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ViewMail id={id} />;
}
