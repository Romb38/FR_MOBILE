export function generateUID(): string {
    return (Date.now() * 1000).toString();
}