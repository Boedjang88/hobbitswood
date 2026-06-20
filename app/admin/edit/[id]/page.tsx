import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditForm from "./EditForm";

export default async function EditProductPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });

  if (!product) {
    notFound();
  }

  return <EditForm product={product} />;
}
