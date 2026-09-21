import { revalidatePath } from "next/cache";

export function revalidatePublicSite() {
  revalidatePath("/", "layout");
  revalidatePath("/packages");
  revalidatePath("/packages/order");
  revalidatePath("/jobs");
  revalidatePath("/jobs/[id]", "page");
  revalidatePath("/cv-generator");
}
