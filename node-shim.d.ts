declare module 'fs/promises' {
  export function readFile(path: string): Promise<Uint8Array>
}

declare module 'path' {
  export function join(...paths: string[]): string
  const _default: {
    join: typeof join
  }
  export default _default
}

