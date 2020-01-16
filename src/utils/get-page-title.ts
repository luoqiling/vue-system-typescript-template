import defaultSettings from '@/settings'

const title = defaultSettings.title

export default function getPageTitle(pageTitle: string): string {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
