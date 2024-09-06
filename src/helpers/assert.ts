export function assert(value: unknown, message?: string): asserts value {
  if (!value) {
    throw new Error(message ?? 'Value is not truthy')
  }
}
