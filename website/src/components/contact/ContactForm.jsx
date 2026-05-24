import { useState } from 'react'
import { Icon } from '@iconify/react'
import api from '../../axiosConfig.js'
import { getApiErrorMessage } from '../../utils/apiError.js'
import { validateContactForm } from '../../utils/contactFormValidation.js'
import { notify } from '../../utils/notify.js'

/**
 * @param {string} base
 * @param {boolean} hasError
 */
function fieldClassName(base, hasError) {
  return hasError ? `${base} contact-field--error` : base
}

/**
 * @param {{ message: string | undefined, id: string }} props
 */
function FieldError({ message, id }) {
  if (!message) return null
  return (
    <p id={id} className="contact-field-error" role="alert">
      {message}
    </p>
  )
}

/**
 * @param {{
 *   copy: import('../../content/contactPage.js').CONTACT_PAGE_CONTENT['en'],
 *   locale: 'en' | 'ar',
 * }} props
 */
export function ContactForm({ copy, locale }) {
  const isRtl = locale === 'ar'
  const [name, setName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [service, setService] = useState('')
  const [inquiry, setInquiry] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState(
    /** @type {Partial<Record<import('../../utils/contactFormValidation.js').ContactField, string>>} */ (
      {}
    ),
  )

  const clearFieldError = (field) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const values = { name, phoneNumber, email, service, inquiry }
    const errors = validateContactForm(values, copy.validation)
    setFieldErrors(errors)

    if (Object.keys(errors).length > 0) {
      notify.error(copy.validation.formInvalid)
      const firstField = Object.keys(errors)[0]
      document.getElementById(`contact-${firstField}`)?.focus()
      return
    }

    setSubmitting(true)
    try {
      await api.post('/public/contact', {
        name: name.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        service,
        inquiry: inquiry.trim(),
      })
      notify.success(copy.success)
      setName('')
      setPhoneNumber('')
      setEmail('')
      setService('')
      setInquiry('')
      setFieldErrors({})
    } catch (err) {
      notify.error(getApiErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>
      <form
        className="contact-form-card blog-post-card-shadow rounded-xl bg-card p-5 sm:p-6 lg:p-7"
        onSubmit={handleSubmit}
        noValidate
      >
        <h2 className="font-heading text-2xl font-bold text-primary dark:text-white sm:text-3xl">
          {copy.formHeading}
        </h2>
        <p className="mt-2 font-body text-sm leading-relaxed text-foreground/75 sm:text-base">
          {copy.formSubtitle}
        </p>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className="contact-field-label">
              {copy.fullName}
            </label>
            <input
              id="contact-name"
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                clearFieldError('name')
              }}
              placeholder={copy.placeholders.fullName}
              className={fieldClassName('contact-field', Boolean(fieldErrors.name))}
              autoComplete="name"
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined}
            />
            <FieldError message={fieldErrors.name} id="contact-name-error" />
          </div>
          <div>
            <label htmlFor="contact-phoneNumber" className="contact-field-label">
              {copy.phoneNumber}
            </label>
            <input
              id="contact-phoneNumber"
              type="tel"
              required
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value)
                clearFieldError('phoneNumber')
              }}
              placeholder={copy.placeholders.phoneNumber}
              className={fieldClassName('contact-field', Boolean(fieldErrors.phoneNumber))}
              autoComplete="tel"
              dir="ltr"
              aria-invalid={Boolean(fieldErrors.phoneNumber)}
              aria-describedby={
                fieldErrors.phoneNumber ? 'contact-phoneNumber-error' : undefined
              }
            />
            <FieldError
              message={fieldErrors.phoneNumber}
              id="contact-phoneNumber-error"
            />
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="contact-email" className="contact-field-label">
            {copy.email}
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              clearFieldError('email')
            }}
            placeholder={copy.placeholders.email}
            className={fieldClassName('contact-field', Boolean(fieldErrors.email))}
            autoComplete="email"
            dir="ltr"
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? 'contact-email-error' : undefined}
          />
          <FieldError message={fieldErrors.email} id="contact-email-error" />
        </div>

        <div className="mt-5">
          <label htmlFor="contact-service" className="contact-field-label">
            {copy.service}
          </label>
          <select
            id="contact-service"
            required
            value={service}
            onChange={(e) => {
              setService(e.target.value)
              clearFieldError('service')
            }}
            className={fieldClassName(
              'contact-field contact-field-select',
              Boolean(fieldErrors.service),
            )}
            aria-invalid={Boolean(fieldErrors.service)}
            aria-describedby={fieldErrors.service ? 'contact-service-error' : undefined}
          >
            <option value="">{copy.chooseService}</option>
            {copy.services.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <FieldError message={fieldErrors.service} id="contact-service-error" />
        </div>

        <div className="mt-5">
          <label htmlFor="contact-inquiry" className="contact-field-label">
            {copy.inquiry}
          </label>
          <textarea
            id="contact-inquiry"
            required
            rows={5}
            value={inquiry}
            onChange={(e) => {
              setInquiry(e.target.value)
              clearFieldError('inquiry')
            }}
            placeholder={copy.placeholders.inquiry}
            className={fieldClassName(
              'contact-field contact-field-textarea resize-y',
              Boolean(fieldErrors.inquiry),
            )}
            aria-invalid={Boolean(fieldErrors.inquiry)}
            aria-describedby={fieldErrors.inquiry ? 'contact-inquiry-error' : undefined}
          />
          <FieldError message={fieldErrors.inquiry} id="contact-inquiry-error" />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="contact-submit-btn mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-transparent py-3 font-body text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 sm:text-base hover:border-primary dark:hover:border-secondary cursor-pointer"
        >
          
          {submitting ? copy.sending : copy.sendMessage}
          <Icon
            icon={submitting ? 'mdi:loading' : 'mdi:send'}
            className={`h-5 w-5 shrink-0 ${submitting ? 'animate-spin' : ''}`}
            aria-hidden
          />
        </button>
      </form>
    </div>
  )
}
