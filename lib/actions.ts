"use server";

import { z } from "zod";
import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { unstable_noStore } from "next/cache";
import { checkAuth } from "./auth";

// ─── Zod Schemas ────────────────────────────────────────
const MarketplaceLinkSchema = z.object({
  platform: z.string().min(1, "Platform name is required"),
  url: z.string().url("Must be a valid URL"),
});

const ProductSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  price: z.coerce.number().min(0, "Price must be positive"),
  stock: z.coerce.number().min(0, "Stock cannot be negative").default(10),
  category: z.string().min(2, "Category is required"),
  images: z.array(
    z.string()
      .url("Valid image URL is required")
      .or(z.string().startsWith("/"))
      .or(z.string().startsWith("data:image/"))
  ).min(1, "At least one image is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  dimensions: z.array(z.string()).min(1, "At least one dimension is required"),
  materials: z.array(z.string()).min(1, "At least one material is required"),
  finishings: z.array(z.string()).min(1, "At least one finishing is required"),
  status: z.enum(["PUBLISHED", "DRAFT"]).default("PUBLISHED"),
  links: z.array(MarketplaceLinkSchema).optional().default([]),
});

const SettingsSchema = z.object({
  promoText: z.string().min(1, "Promo text is required"),
  waNumber: z.string().min(5, "Valid WhatsApp number is required"),
  customOrderWaText: z.string().min(5, "Custom Order WA text is required"),
  email: z.string().email("Valid email is required"),
  workshop: z.string().min(1, "Workshop address is required"),
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
  tokopedia: z.string().optional(),
  shopee: z.string().optional(),
  jamBuka: z.string().min(1, "Jam Buka is required"),
});

// ─── Add Product ────────────────────────────────────────
export async function addProduct(prevState: unknown, formData: FormData) {
  await checkAuth();
  try {
    const name = formData.get("name") as string;
    const customSlug = formData.get("slug") as string;
    let baseSlug = (customSlug || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    if (!baseSlug) {
      baseSlug = "product";
    }

    let slug = baseSlug;
    let suffix = 2;
    
    // Auto-increment slug if duplicate exists
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${suffix}`;
      suffix++;
    }

    // Parse dynamic arrays
    const images = formData.getAll("images").map((v) => (v as string).trim()).filter(Boolean);
    const dimensions = formData.getAll("dimensions").map((v) => (v as string).trim()).filter(Boolean);
    const materials = formData.getAll("materials").map((v) => (v as string).trim()).filter(Boolean);
    const finishings = formData.getAll("finishings").map((v) => (v as string).trim()).filter(Boolean);

    // Parse dynamic marketplace links
    const linksData: { platform: string; url: string }[] = [];
    const linkPlatforms = formData.getAll("linkPlatform");
    const linkUrls = formData.getAll("linkUrl");

    for (let i = 0; i < linkPlatforms.length; i++) {
      const platform = (linkPlatforms[i] as string).trim();
      const url = (linkUrls[i] as string).trim();
      if (platform && url) {
        linksData.push({ platform, url });
      }
    }

    const data = {
      name,
      price: formData.get("price"),
      stock: formData.get("stock") || 10,
      category: formData.get("category"),
      images,
      description: formData.get("description"),
      dimensions,
      materials,
      finishings,
      status: (formData.get("status") as string) || "PUBLISHED",
      links: linksData,
    };

    const parsed = ProductSchema.safeParse(data);

    if (!parsed.success) {
      return {
        success: false,
        error: "Validation failed. Please check the form fields.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    await prisma.$transaction(async (tx) => {
      await (tx as any).product.create({
        data: {
          slug,
          name: parsed.data.name,
          price: parsed.data.price,
          stock: parsed.data.stock,
          category: parsed.data.category,
          images: JSON.stringify(parsed.data.images),
          description: parsed.data.description,
          dimensions: JSON.stringify(parsed.data.dimensions),
          materials: JSON.stringify(parsed.data.materials),
          finishings: JSON.stringify(parsed.data.finishings),
          status: parsed.data.status,
          links: {
            create: parsed.data.links,
          },
        },
      });
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create product";
    return { success: false, error: message };
  }

  revalidatePath("/admin");
  revalidatePath("/shop");
  return { success: true };
}

// ─── Update Product ─────────────────────────────────────
export async function updateProduct(id: string, prevState: unknown, formData: FormData) {
  await checkAuth();
  try {
    const images = formData.getAll("images").map((v) => (v as string).trim()).filter(Boolean);
    const dimensions = formData.getAll("dimensions").map((v) => (v as string).trim()).filter(Boolean);
    const materials = formData.getAll("materials").map((v) => (v as string).trim()).filter(Boolean);
    const finishings = formData.getAll("finishings").map((v) => (v as string).trim()).filter(Boolean);

    // Parse dynamic marketplace links
    const linksData: { platform: string; url: string }[] = [];
    const linkPlatforms = formData.getAll("linkPlatform");
    const linkUrls = formData.getAll("linkUrl");

    for (let i = 0; i < linkPlatforms.length; i++) {
      const platform = (linkPlatforms[i] as string).trim();
      const url = (linkUrls[i] as string).trim();
      if (platform && url) {
        linksData.push({ platform, url });
      }
    }

    const data = {
      name: formData.get("name"),
      price: formData.get("price"),
      stock: formData.get("stock") || 10,
      category: formData.get("category"),
      images,
      description: formData.get("description"),
      dimensions,
      materials,
      finishings,
      status: formData.get("status") || "PUBLISHED",
      links: linksData,
    };

    const parsed = ProductSchema.safeParse(data);

    if (!parsed.success) {
      return {
        success: false,
        error: "Validation failed. Please check the form fields.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return { success: false, error: "Product not found" };
    }

    const customSlug = formData.get("slug") as string;
    let slug = product.slug;
    if (customSlug && customSlug !== product.slug) {
      let baseSlug = customSlug
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      if (baseSlug) {
        slug = baseSlug;
        let suffix = 2;
        while (await prisma.product.findFirst({ where: { slug, id: { not: id } } })) {
          slug = `${baseSlug}-${suffix}`;
          suffix++;
        }
      }
    }

    await (prisma.product as any).update({
      where: { id },
      data: {
        slug,
        name: parsed.data.name,
        price: parsed.data.price,
        stock: parsed.data.stock,
        category: parsed.data.category,
        images: JSON.stringify(parsed.data.images),
        description: parsed.data.description,
        dimensions: JSON.stringify(parsed.data.dimensions),
        materials: JSON.stringify(parsed.data.materials),
        finishings: JSON.stringify(parsed.data.finishings),
        status: parsed.data.status,
        links: {
          deleteMany: {},
          create: parsed.data.links,
        },
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update product";
    return { success: false, error: message };
  }

  revalidatePath("/admin");
  revalidatePath(`/product/[slug]`, "page");
  revalidatePath("/shop");
  return { success: true };
}

// ─── Soft Delete Product ────────────────────────────────
export async function softDeleteProduct(id: string, formData?: FormData) {
  await checkAuth();
  try {
    await prisma.product.update({
      where: { id },
      data: { isDeleted: true },
    });
    revalidatePath("/admin");
    revalidatePath("/shop");
  } catch (err) {
    console.error("Failed to delete product", err);
  }
}

// ─── Toggle Product Status (PUBLISHED ↔ DRAFT) ─────────
export async function toggleProductStatus(id: string, formData?: FormData) {
  await checkAuth();
  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return;

    const newStatus =
      product.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";

    await prisma.product.update({
      where: { id },
      data: { status: newStatus },
    });

    revalidatePath("/admin");
    revalidatePath("/shop");
  } catch (err) {
    console.error("Failed to toggle status", err);
  }
}

// ─── Restore Soft-Deleted Product ───────────────────────
export async function restoreProduct(id: string) {
  await checkAuth();
  try {
    await prisma.product.update({
      where: { id },
      data: { isDeleted: false },
    });
    revalidatePath("/admin");
    revalidatePath("/admin/trash");
    revalidatePath("/shop");
  } catch {
    console.error("Failed to restore product");
  }
}

// ─── Increment Product Views (no revalidation) ─────────
export async function incrementProductView(slug: string) {
  unstable_noStore();
  try {
    await prisma.product.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });
  } catch (error) {
    console.error("Failed to increment views:", error);
  }
}

// ─── Update Site Settings ───────────────────────────────
export async function updateSiteSettings(formData: FormData) {
  await checkAuth();
  try {
    const data = {
      promoText: formData.get("promoText"),
      waNumber: formData.get("waNumber"),
      customOrderWaText: formData.get("customOrderWaText"),
      email: formData.get("email"),
      workshop: formData.get("workshop"),
      instagram: formData.get("instagram"),
      tiktok: formData.get("tiktok"),
      tokopedia: formData.get("tokopedia"),
      shopee: formData.get("shopee"),
      jamBuka: formData.get("jamBuka"),
    };
    const parsed = SettingsSchema.safeParse(data);
    if (!parsed.success) {
      console.error("Validation failed", parsed.error);
      return;
    }

    const existing = await prisma.siteSettings.findFirst();
    if (existing) {
      await prisma.siteSettings.update({
        where: { id: existing.id },
        data: parsed.data,
      });
    } else {
      await prisma.siteSettings.create({
        data: parsed.data,
      });
    }
    revalidatePath("/");
  } catch (err) {
    console.error("Failed to update settings.", err);
  }
}

// ─── Permanently Delete Product ─────────────────────────
export async function permanentlyDeleteProduct(id: string) {
  await checkAuth();
  try {
    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin");
    revalidatePath("/admin/trash");
  } catch (err) {
    console.error("Failed to permanently delete product", err);
  }
}

// ─── Quick Edit Product (Price & Stock) ─────────────────
export async function quickEditProduct(id: string, price: number, stock: number) {
  await checkAuth();
  try {
    if (price < 0 || stock < 0) {
      return { success: false, error: "Price and stock must be positive numbers." };
    }
    await prisma.product.update({
      where: { id },
      data: { price, stock },
    });
    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    return { success: true };
  } catch (error) {
    console.error("Failed to quick edit product", error);
    return { success: false, error: "Failed to update product." };
  }
}
