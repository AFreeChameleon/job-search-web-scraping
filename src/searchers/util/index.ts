export const indeedSpaceReplacer = (spacedText: string) => {
  return spacedText.replace(' ', '+');
}

export const cwjobsSpaceReplacer = (spacedText: string) => {
  return spacedText.toLowerCase().replace(' ', '-');
}

export const totaljobsSpaceReplacer = (spacedText: string) => {
  return spacedText.toLowerCase().replace(' ', '-');
}

export const indeedJSONLinkFormatter = (rawLink: string) => {
  return rawLink.replace('u002F', '');
}