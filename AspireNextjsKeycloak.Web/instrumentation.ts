import { registerOTel } from "@vercel/otel";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./instrumentation.node");
  } else {
    const serviceName = process.env.OTEL_SERVICE_NAME ?? "next-app";
    registerOTel({ serviceName });
  }
}
