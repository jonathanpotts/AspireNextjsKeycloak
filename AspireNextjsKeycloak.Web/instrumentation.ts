import { registerOTel } from "@vercel/otel";

export async function register() {
  const serviceName = process.env.OTEL_SERVICE_NAME ?? "next-app";

  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./instrumentation.node");
  } else {
    registerOTel({ serviceName });
  }
}
