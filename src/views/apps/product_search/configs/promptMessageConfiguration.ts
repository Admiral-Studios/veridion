export const getPromptMessage = (
  prompt: string,
  operands: string[],
  excludeOperands: string,
  strictness = 3,
  supplierTypes: string[],
  countryIn: string[],
  countryInStrictness = 3,
  countryNotIn: string[],
  countryNotInStrictness = 3
) =>
  `Prompt for filter: ${prompt}. The operands that should be included are: ${operands.join(' | ')}.${
    excludeOperands.length ? `The operands that should be excluded are: ${excludeOperands}.` : ''
  } The current search strictness level is: ${strictness}.${
    supplierTypes.length ? `The current supplier types are: ${supplierTypes.join(', ')}.` : ''
  }${
    countryIn.length
      ? `The current locations to be included are: ${countryIn.join(
          ', '
        )}. Strictness level for included locations: ${countryInStrictness}.`
      : ''
  }${
    countryNotIn.length
      ? `The current locations to be excluded are: ${countryNotIn.join(
          ', '
        )}. Strictness level for excluded locations: ${countryNotInStrictness}`
      : ''
  }`
