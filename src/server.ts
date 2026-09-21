import "./lib/error-capture.ts";

import handler, {
  createServerEntry,
} from "@tanstack/react-start/server-entry";

import { consumeLastCapturedError } from "./lib/error-capture.ts";
import { renderErrorPage } from "./lib/error-page.ts";
import { handleApiRequest } from "./server/api.ts";

async function normalizeCatastrophicSsrResponse(
  response: Response,
): Promise<Response> {
  if (response.status < 500) {
    return response;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return response;
  }

  const body = await response.clone().text();

  if (!isH3SwallowedErrorBody(body)) {
    return response;
  }

  console.error(
    consumeLastCapturedError() ??
      new Error(`h3 swallowed SSR error: ${body}`),
  );

  return new Response(renderErrorPage(), {
    status: 500,
    headers: {
      "content-type": "text/html; charset=utf-8",
    },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as {
      unhandled?: unknown;
      message?: unknown;
    };

    return (
      payload.unhandled === true &&
      payload.message === "HTTPError"
    );
  } catch {
    return false;
  }
}

const fetch = async (request: Request) => {
  try {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) {
      const apiResponse = await handleApiRequest(request, url);

      if (apiResponse) {
        return apiResponse;
      }
    }

    const response = await handler.fetch(request);

    return await normalizeCatastrophicSsrResponse(response);
  } catch (error) {
    console.error(error);

    return new Response(renderErrorPage(), {
      status: 500,
      headers: {
        "content-type": "text/html; charset=utf-8",
      },
    });
  }
};

export default createServerEntry({
  fetch,
});