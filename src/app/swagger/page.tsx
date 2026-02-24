"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
import spec from "./swagger.json";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function ApiDocs() {
  return (
    <div style={{ height: "100vh" }}>
      <SwaggerUI spec={spec} />
    </div>
  );
}
