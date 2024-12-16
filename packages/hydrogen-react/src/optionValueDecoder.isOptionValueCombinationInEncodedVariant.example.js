import {isOptionValueCombinationInEncodedVariant} from '@shopify/hydrogen-react';

// product.options = [
//   {
//     name: 'Color',
//     optionValues: [
//       {name: 'Red'},
//       {name: 'Blue'},
//       {name: 'Green'},
//     ]
//   },
//   {
//     name: 'Size',
//     optionValues: [
//       {name: 'S'},
//       {name: 'M'},
//       {name: 'L'},
//     ]
//   }
// ]
const encodedVariantExistence = 'v1_0:0-1,1:2,';

// For reference: decoded encodedVariantExistence
// {
//   [0,0],    // Red, S
//   [0,1],    // Red, M
//   [1,2]     // Blue, L
// }

// Returns true since there are variants exist for [Red]
isOptionValueCombinationInEncodedVariant([0], encodedVariantExistence); // true

isOptionValueCombinationInEncodedVariant([0, 0], encodedVariantExistence); // true
isOptionValueCombinationInEncodedVariant([0, 1], encodedVariantExistence); // true
isOptionValueCombinationInEncodedVariant([0, 2], encodedVariantExistence); // false - no variant exist for [Red, L]

// Returns true since there is a variant exist for [Blue]
isOptionValueCombinationInEncodedVariant([1], encodedVariantExistence); // true

isOptionValueCombinationInEncodedVariant([1, 0], encodedVariantExistence); // false - no variant exist for [Blue, S]
isOptionValueCombinationInEncodedVariant([1, 1], encodedVariantExistence); // false - no variant exist for [Blue, M]
isOptionValueCombinationInEncodedVariant([1, 2], encodedVariantExistence); // true

// Returns false since there is no variant exist for [Green]
isOptionValueCombinationInEncodedVariant([2], encodedVariantExistence); // false
