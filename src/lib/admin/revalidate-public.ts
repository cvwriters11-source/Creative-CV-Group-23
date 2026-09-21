import { revalidatePath } from "next/cache";

export function revalidatePublicSite() {
  revalidatePath("/", "layout");
  revalidatePath("/packages", "layout");
  revalidatePath("/packages/order");
  revalidatePath("/jobs", "layout");
  revalidatePath("/jobs/[id]", "page");
  revalidatePath("/cv-generator");
}
