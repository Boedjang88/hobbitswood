import { prisma } from "@/lib/prisma";
import OurStoryClient from "./OurStoryClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cerita Kami — Hobbits Wood",
  description: "Bermula dari sebuah bengkel kecil di Boyolali, Hobbits Wood dibangun sebagai sebuah studio seni untuk menghadirkan karya kayu terbaik.",
};

export default async function OurStoryPage() {
  const settings = await prisma.siteSettings.findFirst();
  const waNumberRaw = settings?.waNumber || "6285811362629";
  let waNumberClean = waNumberRaw.replace(/\D/g, "");
  if (waNumberClean.startsWith("0")) {
    waNumberClean = "62" + waNumberClean.substring(1);
  }

  return <OurStoryClient waNumber={waNumberClean} />;
}
