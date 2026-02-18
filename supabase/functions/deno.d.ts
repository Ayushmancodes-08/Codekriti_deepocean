declare namespace Deno {
    export var env: {
        get(key: string): string | undefined;
        toObject(): { [key: string]: string };
    };
    export function serve(handler: (req: Request) => Promise<Response> | Response): void;
}
