import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import axiosInstance from '../axiosConfig.js'

const StaticInfoContext = createContext(null)

const ENDPOINT = '/public/static-site-info'

/**
 * @typedef {Object} SocialLink
 * @property {'instagram' | 'facebook' | 'linkedin' | 'youtube'} platform
 * @property {string} url
 */

/**
 * @typedef {Object} StaticSiteInfo
 * @property {string | null} id
 * @property {string | null} phoneNumber
 * @property {string | null} address
 * @property {string | null} addressAr
 * @property {string | null} businessHours
 * @property {string | null} email
 * @property {number | null} latitude
 * @property {number | null} longitude
 * @property {string | null} logoUrl
 * @property {string | null} socialInstagram
 * @property {string | null} socialFacebook
 * @property {string | null} socialLinkedin
 * @property {string | null} socialYoutube
 * @property {SocialLink[]} socialLinks
 * @property {string | null} updatedAt
 */

/**
 * @param {Record<string, unknown> | null | undefined} item
 * @returns {StaticSiteInfo | null}
 */
export function mapStaticInfoFromApi(item) {
  if (!item) return null

  const socialLinks = /** @type {SocialLink[]} */ (
    [
      { platform: 'instagram', url: item.socialInstagram },
      { platform: 'facebook', url: item.socialFacebook },
      { platform: 'linkedin', url: item.socialLinkedin },
      { platform: 'youtube', url: item.socialYoutube },
    ].filter(
      (link) => typeof link.url === 'string' && link.url.trim().length > 0,
    )
  )

  return {
    id: item.id ?? null,
    phoneNumber: item.phoneNumber ?? null,
    address: item.address ?? null,
    addressAr: item.addressAr ?? null,
    businessHours: item.businessHours ?? null,
    email: item.email ?? null,
    latitude: typeof item.latitude === 'number' ? item.latitude : null,
    longitude: typeof item.longitude === 'number' ? item.longitude : null,
    logoUrl: item.logoUrl ?? null,
    socialInstagram: item.socialInstagram ?? null,
    socialFacebook: item.socialFacebook ?? null,
    socialLinkedin: item.socialLinkedin ?? null,
    socialYoutube: item.socialYoutube ?? null,
    socialLinks,
    updatedAt: item.updatedAt ?? null,
  }
}

/**
 * @param {StaticSiteInfo | null} info
 * @param {'en' | 'ar'} locale
 */
export function getLocalizedAddress(info, locale) {
  if (!info) return null
  if (locale === 'ar') {
    return info.addressAr?.trim() || info.address?.trim() || null
  }
  return info.address?.trim() || info.addressAr?.trim() || null
}

export function StaticInfoProvider({ children }) {
  const [staticInfo, setStaticInfo] = useState(
    /** @type {StaticSiteInfo | null} */ (null),
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(/** @type {unknown} */ (null))

  const fetchStaticInfo = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axiosInstance.get(ENDPOINT)
      setStaticInfo(mapStaticInfoFromApi(response.data))
    } catch (err) {
      console.error('Error fetching static site info:', err)
      setError(err)
      setStaticInfo(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStaticInfo()
  }, [fetchStaticInfo])

  useEffect(() => {
    const logoUrl =
      staticInfo && typeof staticInfo.logoUrl === 'string'
        ? staticInfo.logoUrl.trim()
        : ''
    if (!logoUrl) return undefined

    const absoluteHref = new URL(logoUrl, window.location.origin).toString()
    const hrefWithBust = `${absoluteHref}${absoluteHref.includes('?') ? '&' : '?'}v=${Date.now()}`

    document
      .querySelectorAll(
        'link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]',
      )
      .forEach((el) => el.remove())

    const appendIconLink = (rel, sizes) => {
      const link = document.createElement('link')
      link.setAttribute('rel', rel)
      if (sizes) link.setAttribute('sizes', sizes)
      link.setAttribute('href', hrefWithBust)
      if (absoluteHref.toLowerCase().endsWith('.svg')) {
        link.setAttribute('type', 'image/svg+xml')
      }
      document.head.appendChild(link)
    }

    appendIconLink('icon')
    appendIconLink('shortcut icon')
    appendIconLink('apple-touch-icon', '180x180')

    return undefined
  }, [staticInfo?.logoUrl])

  const value = useMemo(
    () => ({
      staticInfo,
      loading,
      error,
      refetch: fetchStaticInfo,
      getLocalizedAddress: (locale) => getLocalizedAddress(staticInfo, locale),
    }),
    [staticInfo, loading, error, fetchStaticInfo],
  )

  return (
    <StaticInfoContext.Provider value={value}>
      {children}
    </StaticInfoContext.Provider>
  )
}

export function useStaticInfo() {
  const context = useContext(StaticInfoContext)
  if (!context) {
    throw new Error('useStaticInfo must be used within a StaticInfoProvider')
  }
  return context
}
