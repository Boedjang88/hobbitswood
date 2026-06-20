"use client";

import { useActionState, useState, useEffect } from "react";
import { updateProduct } from "@/lib/actions";
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EditForm({ product }: { product: any }) {
  const updateProductWithId = updateProduct.bind(null, product.id);
  const [state, formAction, isPending] = useActionState(updateProductWithId, null);
  const [status, setStatus] = useState<"PUBLISHED" | "DRAFT">(product.status);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      toast.success("Produk berhasil diperbarui!");
      // Removed router.push("/admin") to stay on page
    }
  }, [state]);

  // Safely parse JSON strings
  const parseJsonSafe = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : [""];
    } catch {
      return [""];
    }
  };

  // Dynamic lists
  const [images, setImages] = useState<string[]>(parseJsonSafe(product.images));
  const [dimensions, setDimensions] = useState<string[]>(parseJsonSafe(product.dimensions));
  const [materials, setMaterials] = useState<string[]>(parseJsonSafe(product.materials));
  const [finishings, setFinishings] = useState<string[]>(parseJsonSafe(product.finishings));
  const [links, setLinks] = useState<{id?: string, platform: string, url: string}[]>(
    product.links?.length > 0 ? product.links : [{ platform: "", url: "" }]
  );

  // Generic handlers
  const addField = (setter: any, value: any) => setter((prev: any) => [...prev, value]);
  const removeField = (setter: any, index: number) => setter((prev: any) => prev.filter((_: any, i: number) => i !== index));
  const updateField = (setter: any, index: number, value: string) => setter((prev: any) => prev.map((item: any, i: number) => (i === index ? value : item)));

  // Links specific handlers
  const updateLink = (index: number, field: "platform" | "url", value: string) => {
    setLinks((prev) => prev.map((link, i) => (i === index ? { ...link, [field]: value } : link)));
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <Link href="/admin" className="mb-4 inline-flex items-center gap-2 text-sm text-brand-dark dark:text-brand-light transition-colors hover:text-brand-dark dark:hover:text-zinc-100">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-brand-dark dark:text-zinc-100">Edit Product</h1>
        <p className="mt-1 text-sm text-brand-dark dark:text-brand-light">Editing: {product.name}</p>
      </div>

      <form action={formAction} className="space-y-8">
        {/* ─── Basic Details ─── */}
        <div className="rounded-xl border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm transition-colors duration-300">
          <h2 className="mb-6 text-lg font-semibold text-brand-dark dark:text-zinc-100">Basic Details</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-brand-dark dark:text-zinc-100">Product Name *</label>
              <input type="text" id="name" name="name" required defaultValue={product.name} className="w-full rounded-lg border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm outline-none transition-all text-brand-dark dark:text-zinc-100 focus:border-[#111] dark:focus:border-zinc-600 focus:ring-2 focus:ring-[#111]/10 dark:focus:ring-zinc-100/10 placeholder-[#999] dark:placeholder-zinc-600" />
            </div>

            <div>
              <label htmlFor="price" className="mb-2 block text-sm font-medium text-brand-dark dark:text-zinc-100">Price (Rp) *</label>
              <input type="number" id="price" name="price" required min="0" step="1000" defaultValue={product.price} className="w-full rounded-lg border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm outline-none transition-all text-brand-dark dark:text-zinc-100 focus:border-[#111] dark:focus:border-zinc-600 focus:ring-2 focus:ring-[#111]/10 dark:focus:ring-zinc-100/10 placeholder-[#999] dark:placeholder-zinc-600" />
            </div>

            <div>
              <label htmlFor="stock" className="mb-2 block text-sm font-medium text-brand-dark dark:text-zinc-100">Stock *</label>
              <input type="number" id="stock" name="stock" required min="0" defaultValue={product.stock} className="w-full rounded-lg border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm outline-none transition-all text-brand-dark dark:text-zinc-100 focus:border-[#111] dark:focus:border-zinc-600 focus:ring-2 focus:ring-[#111]/10 dark:focus:ring-zinc-100/10 placeholder-[#999] dark:placeholder-zinc-600" />
            </div>

            <div>
              <label htmlFor="category" className="mb-2 block text-sm font-medium text-brand-dark dark:text-zinc-100">Category *</label>
              <input type="text" id="category" name="category" required defaultValue={product.category} className="w-full rounded-lg border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm outline-none transition-all text-brand-dark dark:text-zinc-100 focus:border-[#111] dark:focus:border-zinc-600 focus:ring-2 focus:ring-[#111]/10 dark:focus:ring-zinc-100/10 placeholder-[#999] dark:placeholder-zinc-600" />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="mb-2 block text-sm font-medium text-brand-dark dark:text-zinc-100">Description *</label>
              <textarea id="description" name="description" required rows={5} defaultValue={product.description} className="w-full rounded-lg border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm leading-relaxed outline-none transition-all text-brand-dark dark:text-zinc-100 focus:border-[#111] dark:focus:border-zinc-600 focus:ring-2 focus:ring-[#111]/10 dark:focus:ring-zinc-100/10 placeholder-[#999] dark:placeholder-zinc-600" />
            </div>
          </div>
        </div>

        {/* ─── Image Gallery ─── */}
        <div className="rounded-xl border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm transition-colors duration-300">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-brand-dark dark:text-zinc-100">Image Gallery</h2>
            <button type="button" onClick={() => addField(setImages, "")} className="flex items-center gap-2 rounded-lg border border-[#EAEAEA] dark:border-zinc-700 px-3 py-1.5 text-sm font-medium transition-all hover:bg-[#F5F5F5] dark:hover:bg-zinc-800 text-brand-dark dark:text-zinc-100">
              <Plus className="h-4 w-4" /> Add Image
            </button>
          </div>
          <div className="space-y-3">
            {images.map((img, index) => (
              <div key={index} className="flex items-center gap-3">
                <input type="url" name="images" required value={img} onChange={(e) => updateField(setImages, index, e.target.value)} placeholder="https://..." className="flex-1 rounded-lg border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm outline-none transition-all text-brand-dark dark:text-zinc-100" />
                {images.length > 1 && (
                  <button type="button" onClick={() => removeField(setImages, index)} className="p-2 text-brand-dark dark:text-brand-light hover:text-red-600 dark:hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
                )}
                {img && (
                  <div className="relative h-10 w-10 shrink-0 rounded border border-[#EAEAEA] dark:border-zinc-700 overflow-hidden bg-white dark:bg-zinc-800">
                    <Image src={img} alt="Preview" fill className="object-cover" unoptimized />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ─── Variants ─── */}
        <div className="rounded-xl border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm transition-colors duration-300">
          <h2 className="mb-6 text-lg font-semibold text-brand-dark dark:text-zinc-100">Product Variants</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Dimensions */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <label className="text-sm font-medium text-brand-dark dark:text-zinc-100">Dimensions *</label>
                <button type="button" onClick={() => addField(setDimensions, "")} className="text-brand-dark dark:text-brand-light hover:text-brand-dark dark:text-zinc-400 dark:hover:text-zinc-100"><Plus className="h-4 w-4" /></button>
              </div>
              <div className="space-y-2">
                {dimensions.map((dim, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input type="text" name="dimensions" required value={dim} onChange={(e) => updateField(setDimensions, index, e.target.value)} placeholder="e.g. 100x50 cm" className="flex-1 rounded-lg border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-1.5 text-sm outline-none text-brand-dark dark:text-zinc-100" />
                    {dimensions.length > 1 && <button type="button" onClick={() => removeField(setDimensions, index)} className="text-brand-dark dark:text-brand-light hover:text-red-600"><Trash2 className="h-4 w-4" /></button>}
                  </div>
                ))}
              </div>
            </div>

            {/* Materials */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <label className="text-sm font-medium text-brand-dark dark:text-zinc-100">Materials *</label>
                <button type="button" onClick={() => addField(setMaterials, "")} className="text-brand-dark dark:text-brand-light hover:text-brand-dark dark:text-zinc-400 dark:hover:text-zinc-100"><Plus className="h-4 w-4" /></button>
              </div>
              <div className="space-y-2">
                {materials.map((mat, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input type="text" name="materials" required value={mat} onChange={(e) => updateField(setMaterials, index, e.target.value)} placeholder="e.g. Kayu Jati" className="flex-1 rounded-lg border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-1.5 text-sm outline-none text-brand-dark dark:text-zinc-100" />
                    {materials.length > 1 && <button type="button" onClick={() => removeField(setMaterials, index)} className="text-brand-dark dark:text-brand-light hover:text-red-600"><Trash2 className="h-4 w-4" /></button>}
                  </div>
                ))}
              </div>
            </div>

            {/* Finishings */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <label className="text-sm font-medium text-brand-dark dark:text-zinc-100">Finishings *</label>
                <button type="button" onClick={() => addField(setFinishings, "")} className="text-brand-dark dark:text-brand-light hover:text-brand-dark dark:text-zinc-400 dark:hover:text-zinc-100"><Plus className="h-4 w-4" /></button>
              </div>
              <div className="space-y-2">
                {finishings.map((fin, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input type="text" name="finishings" required value={fin} onChange={(e) => updateField(setFinishings, index, e.target.value)} placeholder="e.g. Natural Walnut" className="flex-1 rounded-lg border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-1.5 text-sm outline-none text-brand-dark dark:text-zinc-100" />
                    {finishings.length > 1 && <button type="button" onClick={() => removeField(setFinishings, index)} className="text-brand-dark dark:text-brand-light hover:text-red-600"><Trash2 className="h-4 w-4" /></button>}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-xl border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm transition-colors duration-300">
            <h2 className="mb-4 text-lg font-semibold text-brand-dark dark:text-zinc-100">Publishing Status</h2>
            <input type="hidden" name="status" value={status} />
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => setStatus("PUBLISHED")} className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${status === "PUBLISHED" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-400/30" : "border border-[#EAEAEA] dark:border-zinc-800 text-brand-dark dark:text-brand-light hover:bg-[#F5F5F5] dark:hover:bg-zinc-800"}`}><span className={`h-2 w-2 rounded-full ${status === "PUBLISHED" ? "bg-emerald-500" : "bg-[#CCC] dark:bg-zinc-600"}`} />Published</button>
              <button type="button" onClick={() => setStatus("DRAFT")} className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${status === "DRAFT" ? "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-200 ring-1 ring-gray-200 dark:ring-zinc-600" : "border border-[#EAEAEA] dark:border-zinc-800 text-brand-dark dark:text-brand-light hover:bg-[#F5F5F5] dark:hover:bg-zinc-800"}`}><span className={`h-2 w-2 rounded-full ${status === "DRAFT" ? "bg-gray-500 dark:bg-zinc-400" : "bg-[#CCC] dark:bg-zinc-600"}`} />Draft</button>
            </div>
          </div>

          <div className="rounded-xl border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm transition-colors duration-300">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-brand-dark dark:text-zinc-100">Marketplace Links</h2>
              <button type="button" onClick={() => setLinks([...links, { platform: "", url: "" }])} className="text-brand-dark dark:text-brand-light hover:text-brand-dark dark:text-zinc-400 dark:hover:text-zinc-100"><Plus className="h-4 w-4" /></button>
            </div>
            <div className="space-y-3">
              {links.map((link, index) => (
                <div key={index} className="flex items-start gap-2">
                  <input type="text" name="linkPlatform" value={link.platform} onChange={(e) => updateLink(index, "platform", e.target.value)} placeholder="Platform" className="w-1/3 rounded-lg border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm outline-none text-brand-dark dark:text-zinc-100" />
                  <input type="url" name="linkUrl" value={link.url} onChange={(e) => updateLink(index, "url", e.target.value)} placeholder="URL" className="w-full rounded-lg border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm outline-none text-brand-dark dark:text-zinc-100" />
                  {links.length > 1 && <button type="button" onClick={() => setLinks(links.filter((_, i) => i !== index))} className="p-2 text-brand-dark dark:text-brand-light hover:text-red-600"><Trash2 className="h-4 w-4" /></button>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {state?.error && (
          <div className="rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400"><p className="font-medium">Error</p><p className="mt-0.5">{state.error}</p></div>
        )}

        <div className="flex items-center justify-between border-t border-[#EAEAEA] dark:border-zinc-800 pt-6">
          <p className="text-xs text-brand-dark dark:text-brand-light">* Required fields</p>
          <div className="flex gap-3">
            <Link href="/admin" className="rounded-lg border border-[#EAEAEA] dark:border-zinc-800 px-6 py-2.5 text-sm font-medium text-brand-dark dark:text-zinc-100 transition-all hover:bg-[#F5F5F5] dark:hover:bg-zinc-800">Cancel</Link>
            <button type="submit" disabled={isPending} className="flex items-center gap-2 rounded-lg bg-[#111] dark:bg-zinc-100 px-6 py-2.5 text-sm font-medium text-white dark:text-zinc-900 transition-all hover:bg-[#333] dark:hover:bg-white hover:shadow-md disabled:opacity-50">
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
