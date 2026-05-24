const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** @typedef {'name' | 'phoneNumber' | 'email' | 'service' | 'inquiry'} ContactField */

/**
 * @param {{
 *   name: string,
 *   phoneNumber: string,
 *   email: string,
 *   service: string,
 *   inquiry: string,
 * }} values
 * @param {import('../content/contactPage.js').CONTACT_PAGE_CONTENT['en']['validation']} messages
 * @returns {Partial<Record<ContactField, string>>}
 */
export function validateContactForm(values, messages) {
  /** @type {Partial<Record<ContactField, string>>} */
  const errors = {}

  const name = values.name.trim()
  const phoneNumber = values.phoneNumber.trim()
  const email = values.email.trim()
  const inquiry = values.inquiry.trim()

  if (!name) {
    errors.name = messages.required
  } else if (name.length > 200) {
    errors.name = messages.nameTooLong
  }

  if (!phoneNumber) {
    errors.phoneNumber = messages.required
  } else if (phoneNumber.length > 50) {
    errors.phoneNumber = messages.phoneTooLong
  }

  if (!email) {
    errors.email = messages.required
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = messages.emailInvalid
  }

  if (!values.service) {
    errors.service = messages.required
  }

  if (!inquiry) {
    errors.inquiry = messages.required
  } else if (inquiry.length > 10_000) {
    errors.inquiry = messages.inquiryTooLong
  }

  return errors
}
