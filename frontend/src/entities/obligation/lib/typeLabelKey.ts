import { Type } from "../model/obligation";

const TYPE_LABEL_KEYS = Object.values(Type);

export type TypeLabelKey = Type;

export function toTypeLabelKey(type: string): TypeLabelKey {
  if ((TYPE_LABEL_KEYS as readonly string[]).includes(type)) {
    return type as TypeLabelKey;
  }

  throw new Error(`Unknown obligation type: ${type}`);
}
