export const formatValue = (value) => Number(value ?? 0).toFixed(3);

export const formatPercent = (value) => `${formatValue(value)}%`;
