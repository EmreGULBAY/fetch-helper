import { from, map, Observable, of, switchMap, share } from "rxjs";

export enum FetchRequestType {
  POST = "POST",
  GET = "GET",
  PUT = "PUT",
  DELETE = "DELETE",
}

const getResponseData = async (response: Response): Promise<unknown> => {
  const contentType = response.headers.get("content-type") || "";

  const typeHandlers: Record<string, () => Promise<unknown>> = {
    "application/json": () => response.json(),
    "text/": () => response.text(),
    "image/": () => response.blob(),
    "application/octet-stream": () => response.blob(),
    "multipart/form-data": () => response.formData(),
  };

  for (const [type, handler] of Object.entries(typeHandlers)) {
    if (contentType.includes(type)) {
      return handler();
    }
  }

  return response.arrayBuffer();
};

export const sendFetchRequestObs = <T>(context: {
  url: string;
  body?: unknown;
  type: FetchRequestType;
  params?: Record<string, string>;
  headers?: Record<string, string>;
  responseType?: ResponseType;
}): Observable<T> => {
  const controller = new AbortController();

  return new Observable<T>((subscriber) => {
    const requestUrl = context.params
      ? `${context.url}?${new URLSearchParams(context.params)}`
      : context.url;

    const requestOptions: RequestInit = {
      method: context.type ?? "POST",
      headers: {
        "content-type": "application/json",
        ...(context.headers ?? {}),
      },
      signal: controller.signal,
    };

    if (context.body) {
      requestOptions.body = JSON.stringify(context.body);
    }

    fetch(requestUrl, requestOptions)
      .then(async (resp) => {
        if (!resp.ok) {
          throw new Error(`HTTP error! status: ${resp.status}`);
        }
        return getResponseData(resp) as Promise<T>;
      })
      .then((data) => {
        subscriber.next(data);
        subscriber.complete();
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          subscriber.complete();
        } else {
          subscriber.error(error);
        }
      });

    return () => controller.abort();
  });
};

export const sendFetchRequest = async <T>(context: {
  url: string;
  body?: unknown;
  type: FetchRequestType;
  params?: Record<string, string>;
  headers?: Record<string, string>;
}): Promise<T> => {
  try {
    const requestUrl = context.params
      ? `${context.url}?${new URLSearchParams(context.params)}`
      : context.url;
    const requestOptions: RequestInit = {
      method: context.type ?? "POST",
      headers: {
        "content-type": "application/json",
        ...(context.headers ?? {}),
      },
    };

    if (context.body) {
      requestOptions.body = JSON.stringify(context.body);
    }

    const response = await fetch(requestUrl, requestOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return getResponseData(response) as Promise<T>;
  } catch (err) {
    throw err;
  }
};