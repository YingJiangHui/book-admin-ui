// Option 数组类型 转为 Map 类型
export const transOptionsToMap = <K extends string | number, V>(
  options: { label: V; value: K; [key: string]: any }[],
) => {
  return options.reduce(
    (map, item) => ({ ...map, [item.value]: item.label }),
    {} as Record<string, any>,
  );
};

// Map 类型转为 Option 数组类型
export const transMapToOptions = (map: Record<string, any>) => {
  return Object.keys(map).reduce(
    (list, key) => list.concat({ value: key, label: map[key] }),
    [] as { value: string; label: string }[],
  );
};
