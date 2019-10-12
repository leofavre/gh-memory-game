export const parseArrayAttr = attrValue =>
  attrValue != null ? JSON.parse(`[${attrValue}]`) : attrValue;
