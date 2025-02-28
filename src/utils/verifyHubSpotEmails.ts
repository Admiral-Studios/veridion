const ignoreEmailDomains = ['veridion', 'soleadify', 'gmail', 'storiesofdata']

export const verifyHubSpotEmail = (email: string) => {
  const emailDomain = email.split('@')[1].split('.')[0]

  return !ignoreEmailDomains.includes(emailDomain)
}
