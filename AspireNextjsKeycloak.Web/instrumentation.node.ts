import { OTLPTraceExporter as OTLPGrpcTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { registerOTel } from "@vercel/otel";

const protocol = process.env.OTEL_EXPORTER_OTLP_PROTOCOL;

const spanProcessors =
  protocol === "grpc"
    ? [new SimpleSpanProcessor(new OTLPGrpcTraceExporter())]
    : undefined;

registerOTel({ spanProcessors });
