export const generalStrictnessLabels = [
  "Highest level of strictness, lower number of results. Using this setting, the API searches a limited set of attributes that we have identified as being particularly valuable in terms of generating accurate results. These attributes refer to the product headline, the product page's HTML meta information, and a selection of relevant company details. Since this is the strictest search level, it will generate the least amount of results, with the benefit of increased accuracy.",
  'Medium strictness, moderate number of results. The API will split the product and company-related attributes into two groups based on a level of trust associated with each attribute, from a product extraction perspective. It will first search using the less trusted attributes to create a pool of candidates. It will then validate the candidates based on the most trusted attributes. This level of strictness will balance the number of results and accuracy.',
  'Lowest strictness, highest number of results. he API will search a comprehensive list of product and company-related information and meta-information extracted from the HTML product and company pages. Being the most permissive setting, it will yield the greatest number of results, while the accuracy might slightly decrease towards the tail of the results list. This serves as the default strictness level when no specific parameter value is passed.'
]

export const generalStrictnessTitles = ['1 - Highest strictness', '2 - Medium strictness', '3 - Lowest strictness']

export const locationStrictnessLabels = [
  '1 - Main location',
  '2 - Secondary locations',
  '3 - Main and secondary locations'
]
