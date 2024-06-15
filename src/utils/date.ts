import dayjs, { Dayjs } from 'dayjs';

export function getRangeDateOnUnitOfTime(
  DateMap: { [key: string]: string | Dayjs | undefined },
  options?: { endAndStartOf?: dayjs.OpUnitType; format?: string },
) {
  const { endAndStartOf = 'day', format } = options || {};
  const isStartTime = (key: string) => {
    return /[S|s]tart/.test(key);
  };
  const isEndTime = (key: string) => {
    return /[E|e]nd/.test(key);
  };
  const reducer = (map: Object, key: string) => ({
    ...map,
    [key]: !DateMap[key]
      ? undefined
      : isStartTime(key) || isEndTime(key)
      ? isStartTime(key)
        ? dayjs(DateMap[key])?.startOf(endAndStartOf).format(format)
        : dayjs(DateMap[key])?.endOf(endAndStartOf).format(format)
      : dayjs(DateMap[key])?.format(format),
  });
  return Object.keys(DateMap).reduce(reducer, {}) as Record<string, string>;
}
