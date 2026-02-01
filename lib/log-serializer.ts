import { Prisma } from "@prisma/client";

export function safeJson(value: any) {
  return JSON.stringify(value, (_k, v) => {
    if (v instanceof Date) return v.toISOString();
    if (v instanceof Prisma.Decimal) return v.toString();
    if (typeof v === "bigint") return v.toString();
    return v;
  });
}
