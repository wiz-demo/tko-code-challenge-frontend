declare module "swagger-ui-react" {
  import { ComponentType } from "react";

  interface SwaggerUIProps {
    spec?: Record<string, unknown>;
    url?: string;
    layout?: string;
    docExpansion?: "list" | "full" | "none";
    defaultModelExpandDepth?: number;
    defaultModelsExpandDepth?: number;
    displayOperationId?: boolean;
    filter?: boolean | string;
    showExtensions?: boolean;
    showCommonExtensions?: boolean;
    supportedSubmitMethods?: string[];
    tryItOutEnabled?: boolean;
  }

  const SwaggerUI: ComponentType<SwaggerUIProps>;
  export default SwaggerUI;
}
