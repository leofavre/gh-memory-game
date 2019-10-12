export const parseNumericAttr = attrValue => {
  const isDefined = attrValue != null &&
    attrValue !== '' &&
    !Number.isNaN(Number(attrValue));

  return isDefined ? Number(attrValue) : undefined;
};
