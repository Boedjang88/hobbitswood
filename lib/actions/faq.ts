"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkAuth } from "../auth";

export async function addFaqCategory(formData: FormData) {
  await checkAuth();
  const title = formData.get("title") as string;
  const order = parseInt(formData.get("order") as string) || 0;

  if (!title) throw new Error("Title is required");

  try {
    await prisma.faqCategory.create({
      data: { title, order },
    });
    revalidatePath("/admin/faq");
    revalidatePath("/faq");
  } catch (error) {
    console.error("Failed to create category", error);
  }
}

export async function deleteFaqCategory(id: string) {
  await checkAuth();
  try {
    await prisma.faqCategory.delete({
      where: { id },
    });
    revalidatePath("/admin/faq");
    revalidatePath("/faq");
  } catch (error) {
    console.error("Failed to delete category", error);
  }
}

export async function addFaqItem(formData: FormData) {
  await checkAuth();
  const question = formData.get("question") as string;
  const answer = formData.get("answer") as string;
  const categoryId = formData.get("categoryId") as string;
  const order = parseInt(formData.get("order") as string) || 0;

  if (!question || !answer || !categoryId) throw new Error("Missing fields");

  try {
    await prisma.faqItem.create({
      data: { question, answer, categoryId, order },
    });
    revalidatePath("/admin/faq");
    revalidatePath("/faq");
  } catch (error) {
    console.error("Failed to create FAQ item", error);
  }
}

export async function deleteFaqItem(id: string) {
  await checkAuth();
  try {
    await prisma.faqItem.delete({
      where: { id },
    });
    revalidatePath("/admin/faq");
    revalidatePath("/faq");
  } catch (error) {
    console.error("Failed to delete item", error);
  }
}
