export const DEFAULT_OBLIGATION_LIST_SKELETON_COUNT = 5;

export function skeletonItemKeys(count: number): number[] {
  if (!Number.isInteger(count) || count < 0) {
    throw new Error(`Invalid skeleton count: ${count}`);
  }

  return Array.from({ length: count }, (_, index) => index);
}
