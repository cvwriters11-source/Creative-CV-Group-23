import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/session";
import { getPackageServiceCatalog, savePackageServiceCatalog } from "@/lib/admin/store";
import type { PackageService } from "@/lib/admin/types";
import { packages } from "@/lib/packages";

export const runtime = "nodejs";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const catalog = await getPackageServiceCatalog();
  return NextResponse.json(catalog);
}

export async function POST(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    action?: "save" | "add";
    services?: PackageService[];
    map?: Record<string, string[]>;
    label?: string;
    packageIds?: string[];
  };

  const current = await getPackageServiceCatalog();

  if (body.action === "add") {
    const label = body.label?.trim();
    if (!label) return NextResponse.json({ error: "Service name is required." }, { status: 400 });
    const base = slugify(label) || `service-${Date.now()}`;
    let id = base;
    let n = 2;
    while (current.services.some((item) => item.id === id)) {
      id = `${base}-${n}`;
      n += 1;
    }
    const services = [...current.services, { id, label, custom: true }];
    const map = { ...current.map };
    const enabled = new Set(body.packageIds ?? []);
    for (const pkg of packages) {
      const next = new Set(map[pkg.id] ?? []);
      if (enabled.has(pkg.id)) next.add(id);
      else next.delete(id);
      map[pkg.id] = [...next];
    }
    await savePackageServiceCatalog({ services, map });
    return NextResponse.json(await getPackageServiceCatalog());
  }

  if (!body.services || !body.map) {
    return NextResponse.json({ error: "Services and package map are required." }, { status: 400 });
  }

  await savePackageServiceCatalog({ services: body.services, map: body.map });
  return NextResponse.json(await getPackageServiceCatalog());
}

export async function DELETE(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { id?: string };
  if (!body.id) return NextResponse.json({ error: "Service id is required." }, { status: 400 });

  const current = await getPackageServiceCatalog();
  const target = current.services.find((item) => item.id === body.id);
  if (!target) return NextResponse.json({ error: "Service not found." }, { status: 404 });
  if (!target.custom) {
    return NextResponse.json({ error: "Built-in services can be switched off per package, not deleted." }, { status: 400 });
  }

  const services = current.services.filter((item) => item.id !== body.id);
  const map = Object.fromEntries(
    Object.entries(current.map).map(([pkgId, ids]) => [pkgId, ids.filter((id) => id !== body.id)]),
  );
  await savePackageServiceCatalog({ services, map });
  return NextResponse.json(await getPackageServiceCatalog());
}
