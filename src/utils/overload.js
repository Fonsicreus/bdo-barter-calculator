// Temporary planning assumption requested by the player, not a verified game limit.
export const OVERLOAD_CAPACITY_MULTIPLIER = 1.5;

export function getOverloadCapacity(normalCapacity) {
  return Number.isFinite(normalCapacity) && normalCapacity > 0
    ? normalCapacity * OVERLOAD_CAPACITY_MULTIPLIER
    : null;
}
