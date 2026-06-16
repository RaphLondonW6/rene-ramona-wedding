'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLanguage } from '@/context/LanguageContext'

const RSVP_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbyF7hfTXoQHWHwwq13syhCktAicjsTlokS1i7dJU7Kxhfc3nAZGm0Ab3YUYnKKUztREQw/exec'

type FormValues = {
  firstName: string
  lastName: string
  email: string
  phone: string
  attendance: 'attending' | 'not-attending'
  message: string
  dietary: string
  dietaryOther: string
  gdpr: boolean
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function RSVP() {
  const { t } = useLanguage()
  const f = t.rsvp.form
  const sectionRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [honeypot, setHoneypot] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { attendance: 'attending', dietary: 'none' },
  })

  const dietary = watch('dietary')
  const attendance = watch('attendance')

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.08 }
    )
    sectionRef.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const onSubmit = async (data: FormValues) => {
    // Honeypot spam check
    if (honeypot) return

    setStatus('submitting')

    const body = new URLSearchParams()
    Object.entries({ ...data, submittedAt: new Date().toISOString() })
      .forEach(([k, v]) => body.append(k, String(v ?? '')))

    // Fire-and-forget: no-cors returns an opaque response we can't read.
    // The browser sends the request regardless — just show success.
    fetch(RSVP_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    }).catch(console.error)

    setStatus('success')
  }

  if (status === 'success') {
    return (
      <SuccessBanner
        title={f.successTitle}
        message={f.successMessage}
      />
    )
  }

  return (
    <div
      ref={sectionRef}
      className="section-base bg-ivory"
      style={{ background: 'linear-gradient(180deg, #FDFBF7 0%, #F5ECD7 80%, #FDFBF7 100%)' }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="reveal text-champagne text-3xl mb-6" aria-hidden="true">✦</div>
          <h2 className="reveal section-title">{t.rsvp.title}</h2>
          <div className="reveal gold-divider my-6" />
          <p className="reveal section-subtitle">{t.rsvp.subtitle}</p>
        </div>

        {/* Dress Code Card */}
        <div className="reveal bg-white/80 border border-cream/80 p-6 md:p-8 mb-10 shadow-sm text-center">
          <p className="font-serif-display text-xl text-champagne mb-3">{t.rsvp.dresscode.title}</p>
          <p className="font-serif-body text-lg italic text-lightText mb-2">{t.rsvp.dresscode.subtitle}</p>
          <p className="font-body text-sm text-darkText">{t.rsvp.dresscode.men}</p>
          <p className="font-body text-sm text-darkText">{t.rsvp.dresscode.women}</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="reveal bg-white/80 backdrop-blur-sm border border-cream/80 p-6 md:p-10 shadow-sm"
        >
          {/* Honeypot (hidden from real users) */}
          <input
            type="text"
            name="_hp"
            tabIndex={-1}
            aria-hidden="true"
            className="absolute opacity-0 h-0 w-0 overflow-hidden"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />

          {/* Name row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Field label={f.firstName} error={errors.firstName?.message}>
              <input
                {...register('firstName', { required: f.required })}
                className={`form-input ${errors.firstName ? 'error' : ''}`}
                placeholder={f.firstName}
                autoComplete="given-name"
              />
            </Field>
            <Field label={f.lastName} error={errors.lastName?.message}>
              <input
                {...register('lastName', { required: f.required })}
                className={`form-input ${errors.lastName ? 'error' : ''}`}
                placeholder={f.lastName}
                autoComplete="family-name"
              />
            </Field>
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Field label={f.email} error={errors.email?.message}>
              <input
                {...register('email', {
                  required: f.required,
                  pattern: { value: /^\S+@\S+\.\S+$/, message: f.invalidEmail },
                })}
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </Field>
            <Field label={f.phone} error={errors.phone?.message}>
              <input
                {...register('phone', { required: f.required })}
                type="tel"
                className={`form-input ${errors.phone ? 'error' : ''}`}
                placeholder="+44 …"
                autoComplete="tel"
              />
            </Field>
          </div>

          {/* Attendance */}
          <Field label={f.attendance} className="mb-4">
            <div className="flex gap-4">
              {(['attending', 'not-attending'] as const).map((val) => (
                <label key={val} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    {...register('attendance')}
                    type="radio"
                    value={val}
                    className="w-4 h-4 accent-champagne"
                  />
                  <span className="font-body text-sm text-darkText group-hover:text-champagne transition-colors">
                    {val === 'attending' ? f.attending : f.notAttending}
                  </span>
                </label>
              ))}
            </div>
          </Field>

          {/* Fields only shown when attending */}
          {attendance === 'attending' && (
            <>
              {/* Dietary */}
              <Field label={f.dietary} className="mb-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(Object.entries(f.dietaryOptions) as [string, string][]).map(([val, label]) => (
                    <label key={val} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        {...register('dietary')}
                        type="radio"
                        value={val}
                        className="w-4 h-4 accent-champagne"
                      />
                      <span className="font-body text-sm text-darkText group-hover:text-champagne transition-colors">
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </Field>

              {dietary === 'other' && (
                <Field label="" className="mb-4">
                  <input
                    {...register('dietaryOther')}
                    className="form-input"
                    placeholder={f.dietaryOtherPlaceholder}
                  />
                </Field>
              )}

              {/* Meal Selection — informational */}
              <div className="mb-6 border border-cream/80 bg-cream/30 p-6">
                <h3 className="font-serif-display text-xl text-darkText mb-4 text-center">{f.mealTitle}</h3>

                {/* Starters */}
                <h4 className="font-serif-display text-base text-champagne mb-2">{f.starterTitle}</h4>
                <div className="bg-white/70 p-4 border border-cream/80 mb-4">
                  <p className="font-serif-body text-sm italic text-lightText mb-3">{f.starterNote}</p>
                  <ul className="list-none space-y-1">
                    {f.starters.map((s, i) => (
                      <li key={i} className="font-body text-sm text-darkText flex items-start gap-2">
                        <span className="text-champagne mt-0.5" aria-hidden="true">·</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Main Courses */}
                <h4 className="font-serif-display text-base text-champagne mb-2">{f.mainCourseTitle}</h4>
                <div className="bg-white/70 p-4 border border-cream/80 mb-4">
                  <ul className="list-none space-y-1">
                    {(f.mainCourseItems as string[]).map((item, i) => (
                      <li key={i} className="font-body text-sm text-darkText flex items-start gap-2">
                        <span className="text-champagne mt-0.5" aria-hidden="true">·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Dessert */}
                <h4 className="font-serif-display text-base text-champagne mb-2">{f.dessertTitle}</h4>
                <div className="bg-white/70 p-4 border border-cream/80">
                  <ul className="list-none space-y-1">
                    <li className="font-body text-sm text-darkText flex items-start gap-2">
                      <span className="text-champagne mt-0.5" aria-hidden="true">·</span>
                      {f.dessertItem}
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}

          {/* Optional message */}
          <Field label={f.message} className="mb-4">
            <textarea
              {...register('message')}
              rows={4}
              className="form-input resize-none"
              placeholder={f.messagePlaceholder}
            />
          </Field>

          {/* GDPR */}
          <div className="mb-6">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                {...register('gdpr', { required: f.required })}
                type="checkbox"
                className="w-4 h-4 mt-0.5 accent-champagne flex-shrink-0"
              />
              <span className="font-body text-xs text-lightText leading-relaxed group-hover:text-darkText transition-colors">
                {f.gdpr}
              </span>
            </label>
            {errors.gdpr && (
              <p className="text-red-500 text-xs mt-1 ml-7" role="alert">{f.required}</p>
            )}
          </div>

          {/* Submit */}
          {status === 'error' && (
            <p className="text-red-500 text-sm mb-4 text-center" role="alert">{f.errorMessage}</p>
          )}

          <div className="text-center">
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="btn-gold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? (
                <>
                  <Spinner /> {f.submitting}
                </>
              ) : (
                f.submit
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({
  label,
  error,
  children,
  className = '',
}: {
  label: string
  error?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block font-body text-xs tracking-widest uppercase text-lightText mb-1.5">
          {label}
        </label>
      )}
      {children}
      {error && (
        <p className="text-red-500 text-xs mt-1" role="alert">{error}</p>
      )}
    </div>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

function SuccessBanner({ title, message }: { title: string; message: string }) {
  return (
    <div
      className="section-base flex items-center justify-center"
      style={{ background: 'linear-gradient(180deg, #FDFBF7 0%, #F5ECD7 100%)', minHeight: '60vh' }}
    >
      <div className="text-center max-w-lg">
        <div className="text-6xl mb-6" aria-hidden="true">💌</div>
        <h2 className="font-serif-display text-4xl text-darkText mb-4">{title}</h2>
        <div className="gold-divider my-6" />
        <p className="font-serif-body text-xl italic text-lightText">{message}</p>
      </div>
    </div>
  )
}
