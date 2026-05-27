import { getProducts } from "@/actions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const page = sp.get("page") ? parseInt(sp.get("page")!) : 1;
  const search = sp.get("search") || undefined;
  const status = sp.get("status") || undefined;
  const category = sp.get("category") || undefined;
  const plantType = sp.get("plantType") || undefined;

  const result = await getProducts({ search, status, category, plantType, page, perPage: 10 });
  return NextResponse.json(result);
}
