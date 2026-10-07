import { NextResponse } from "next/server";
import { addTeamFileVersion, listOrderNumberOptions, readAdminStore, searchTeamFiles } from "@/lib/admin/store";
import { getTeamActor } from "@/lib/team";
import { saveTeamUpload } from "@/lib/uploads";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const actor = await getTeamActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const query = new URL(request.url).searchParams.get("q") ?? "";
  const store = await readAdminStore();
  return NextResponse.json({
    files: searchTeamFiles(store, query),
    orders: listOrderNumberOptions(store),
    me: actor,
  });
}

export async function POST(request: Request) {
  const actor = await getTeamActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await request.formData();
  const orderNumber = String(form.get("orderNumber") ?? "").trim();
  const uploads = form
    .getAll("file")
    .filter((item): item is File => item instanceof File && item.size > 0)
    .slice(0, 3);
  if (!orderNumber) {
    return NextResponse.json({ error: "Enter an order number." }, { status: 400 });
  }
  if (!uploads.length) {
    return NextResponse.json({ error: "Choose at least one file to upload." }, { status: 400 });
  }

  const groups = [];
  let matchedOrder = false;
  for (const file of uploads) {
    const storedName = `v${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${file.name.replace(/[^\w.\-]+/g, "_").slice(0, 80) || "file"}`;
    try {
      await saveTeamUpload(orderNumber, storedName, file);
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Could not save that file." },
        { status: 400 },
      );
    }

    const result = await addTeamFileVersion({
      orderNumber,
      fileName: file.name,
      storedName,
      size: file.size,
      uploadedByName: actor.name,
      uploadedByEmail: actor.email,
      uploadedByRole: actor.role,
    });
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    groups.push(result.group);
    if (result.matchedOrder) matchedOrder = true;
  }

  return NextResponse.json({
    groups,
    group: groups[0],
    warning: matchedOrder ? undefined : "No order uses that number yet. The files are still saved under it.",
  });
}
