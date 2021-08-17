import { IState } from "@/store/state";

export function applyFilters<T, R>(
  items: (state: IState) => T[],
  filters: (state: IState) => R,
  ...fns: Array<(filters: R, items: T[]) => T[]>
): (state: IState) => T[] {
  return (state) => {
    const f = filters(state);
    return fns.reduce((res, fn) => fn(f, res), items(state));
  };
}

export function inFilter(key: string) {
  return function<T>(
    filters: { [key: string]: (number | string)[] | any },
    items: T[]
  ): T[] {
    const { enabled, value } = filters[key];
    if (!enabled || !value.length) return items;
    return items.filter((item) =>
      value.some((i: any) => i == (item as any)[key])
    );
  };
}

export function rangeFilter(key: string) {
  return function<T>(
    filters: { [key: string]: { min: number; max: number } | any },
    items: T[]
  ): T[] {
    const {
      enabled,
      value: { min, max },
    } = filters[key];
    if (!enabled) return items;
    return items.filter((i) => {
      const v: number = (i as any)[key];
      return v >= min && v <= max;
    });
  };
}
