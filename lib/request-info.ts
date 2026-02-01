export function getRequestInfo(req: Request) {
  const userAgent = req.headers.get("user-agent") || null;

  // Works in production behind proxies (Vercel/nginx/etc.)
  const xff = req.headers.get("x-forwarded-for");
  const xRealIp = req.headers.get("x-real-ip");

  const ip =
    (xff ? xff.split(",")[0].trim() : null) ||
    (xRealIp ? xRealIp.trim() : null) ||
    null;

  return { ip, userAgent };
}
