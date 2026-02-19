declare namespace Deno {
    export interface Env {
        get(key: string): string | undefined;
    }

    export interface ServeOptions {
        port?: number;
        hostname?: string;
        signal?: AbortSignal;
        onListen?: (params: { hostname: string; port: number }) => void;
        onError?: (error: unknown) => Response | Promise<Response>;
    }

    export function serve(
        handler: (request: Request, info: any) => Response | Promise<Response>
    ): void;
    export function serve(
        options: ServeOptions,
        handler: (request: Request, info: any) => Response | Promise<Response>
    ): void;
}
