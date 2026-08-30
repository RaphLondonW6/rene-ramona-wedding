'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { useLanguage } from '@/context/LanguageContext'

const RSVP_ENDPOINT = 'https://n8n.ramonapicksrene.com/webhook/rsvp-wedding'

type ChildEntry = { name: string; age: string }

type FormValues = {
  firstName: string
  lastName: string
  email: string
  phone: string
  attendance: 'attending' | 'not-attending'
  nationality: string
  message: string
  dietary: string
  dietaryOther: string
  gdpr: boolean
  hasPartner: 'yes' | 'no'
  partnerFirstName: string
  partnerLastName: string
  partnerDietary: string
  partnerDietaryOther: string
  hasChildren: 'yes' | 'no'
  children: ChildEntry[]
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function RSVP() {
  const { t } = useLanguage()
  const f = t.rsvp.form
  const ff = f as any
  const sectionRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [honeypot, setHoneypot] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      attendance: 'attending',
      dietary: 'none',
      hasPartner: 'no',
      partnerDietary: 'none',
      hasChildren: 'no',
      children: [],
    },
  })

  const { fields: childFields, append: appendChild, remove: removeChild } = useFieldArray({
    control,
    name: 'children',
  })

  const dietary = watch('dietary')
  const partnerDietary = watch('partnerDietary')
  const attendance = watch('attendance')
  const hasPartner = watch('hasPartner')
  const hasChildren = watch('hasChildren')

  // Auto-add first child slot when guest enables hasChildren
  useEffect(() => {
    if (hasChildren === 'yes' && childFields.length === 0) {
      appendChild({ name: '', age: '' })
    }
  }, [hasChildren]) // eslint-disable-line react-hooks/exhaustive-deps

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
    if (honeypot) return
    setStatus('submitting')

    try {
      const payload: Record<string, unknown> = {
        firstName:    data.firstName,
        lastName:     data.lastName,
        email:        data.email,
        phone:        data.phone,
        nationality:  data.nationality,
        attendance:   data.attendance === 'attending' ? 'true' : 'false',
        dietary:      data.dietary,
        otherDietary: data.dietaryOther,
        message:      data.message,
      }

      if (data.attendance === 'attending') {
        payload.hasPartner = data.hasPartner
        if (data.hasPartner === 'yes') {
          payload.partnerFirstName    = data.partnerFirstName
          payload.partnerLastName     = data.partnerLastName
          payload.partnerDietary      = data.partnerDietary
          payload.partnerOtherDietary = data.partnerDietaryOther
        }
        payload.hasChildren = data.hasChildren
        if (data.hasChildren === 'yes' && data.children.length > 0) {
          payload.childrenCount   = data.children.length
          payload.childrenDetails = JSON.stringify(data.children)
        }
      }

      const res = await fetch(RSVP_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setStatus('success')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  // Scroll to RSVP section on success so the banner is visible
  useEffect(() => {
    if (status === 'success') {
      const el = document.getElementById('rsvp')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [status])

  return (
    <div
      ref={sectionRef}
      className="section-base bg-ivory"
      style={{ background: 'linear-gradient(180deg, #E1BF92 0%, #DFE0E1 80%, #E1BF92 100%)' }}
    >
      {status === 'success' && (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-lg">
            <div className="text-6xl mb-6" aria-hidden="true">💌</div>
            <h2 className="font-serif-display text-4xl text-darkText mb-4">{f.successTitle}</h2>
            <div className="gold-divider my-6" />
            <p className="font-serif-body text-xl italic text-darkText">{f.successMessage}</p>
          </div>
        </div>
      )}
      {status !== 'success' && (
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="reveal text-champagne text-3xl mb-6" aria-hidden="true">✦</div>
          <h2 className="reveal section-title">{t.rsvp.title}</h2>
          <div className="reveal gold-divider my-6" />
          <p className="reveal section-subtitle !text-white">{t.rsvp.subtitle}</p>
        </div>

        {/* Dress Code Card */}
        <div className="reveal bg-white/80 border border-cream/80 p-6 md:p-8 mb-10 shadow-sm text-center">
          <p className="font-serif-display text-xl text-champagne mb-3">{t.rsvp.dresscode.title}</p>
          <p className="font-serif-body text-lg italic text-lightText">{t.rsvp.dresscode.subtitle}</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="reveal bg-white/80 backdrop-blur-sm border border-cream/80 p-6 md:p-10 shadow-sm"
        >
          {/* Honeypot */}
          <input
            type="text"
            name="_hp"
            tabIndex={-1}
            aria-hidden="true"
            className="absolute opacity-0 h-0 w-0 overflow-hidden"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />

          {/* ── Your details ── */}
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
            <Field
              label={
                <>
                  {f.phone}{' '}
                  <span className="italic normal-case tracking-normal text-lightText/70">
                    {ff.optionalLabel}
                  </span>
                </>
              }
              error={errors.phone?.message}
            >
              <input
                {...register('phone')}
                type="tel"
                className={`form-input ${errors.phone ? 'error' : ''}`}
                placeholder="RO +40, UK +44, SK +421"
                autoComplete="tel"
              />
            </Field>
          </div>

          {/* Nationality */}
          <Field label={ff.nationality} className="mb-4">
            <select
              {...register('nationality')}
              className="form-input bg-white"
              defaultValue=""
            >
              <option value="" disabled>{ff.nationalityPlaceholder}</option>
              <optgroup label="— Most common —">
                <option value="Romanian">Romanian</option>
                <option value="Slovak">Slovak</option>
                <option value="French">French</option>
                <option value="British">British</option>
              </optgroup>
              <optgroup label="— Other —">
                <option value="Albanian">Albanian</option>
                <option value="American">American</option>
                <option value="Australian">Australian</option>
                <option value="Austrian">Austrian</option>
                <option value="Belgian">Belgian</option>
                <option value="Bulgarian">Bulgarian</option>
                <option value="Canadian">Canadian</option>
                <option value="Croatian">Croatian</option>
                <option value="Czech">Czech</option>
                <option value="Danish">Danish</option>
                <option value="Dutch">Dutch</option>
                <option value="Estonian">Estonian</option>
                <option value="Finnish">Finnish</option>
                <option value="German">German</option>
                <option value="Greek">Greek</option>
                <option value="Hungarian">Hungarian</option>
                <option value="Irish">Irish</option>
                <option value="Italian">Italian</option>
                <option value="Latvian">Latvian</option>
                <option value="Lithuanian">Lithuanian</option>
                <option value="Luxembourgish">Luxembourgish</option>
                <option value="Maltese">Maltese</option>
                <option value="Moldovan">Moldovan</option>
                <option value="Norwegian">Norwegian</option>
                <option value="Polish">Polish</option>
                <option value="Portuguese">Portuguese</option>
                <option value="Serbian">Serbian</option>
                <option value="Slovenian">Slovenian</option>
                <option value="Spanish">Spanish</option>
                <option value="Swedish">Swedish</option>
                <option value="Swiss">Swiss</option>
                <option value="Ukrainian">Ukrainian</option>
                <option value="Other">Other</option>
              </optgroup>
            </select>
          </Field>

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
              {/* Your dietary */}
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

              {/* ── Partner / +1 ── */}
              <div className="border-t border-cream/60 pt-6 mt-2 mb-4">
                <Field label={ff.hasPartner} className="mb-4">
                  <div className="flex gap-4">
                    {(['yes', 'no'] as const).map((val) => (
                      <label key={val} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          {...register('hasPartner')}
                          type="radio"
                          value={val}
                          className="w-4 h-4 accent-champagne"
                        />
                        <span className="font-body text-sm text-darkText group-hover:text-champagne transition-colors">
                          {val === 'yes' ? ff.partnerYes : ff.partnerNo}
                        </span>
                      </label>
                    ))}
                  </div>
                </Field>

                {hasPartner === 'yes' && (
                  <div className="bg-white/60 border border-cream/60 p-4 md:p-6 mt-2">
                    <p className="font-serif-display text-base text-champagne mb-4">{ff.partnerSection}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <Field label={ff.partnerFirstName} error={errors.partnerFirstName?.message}>
                        <input
                          {...register('partnerFirstName', { required: hasPartner === 'yes' ? f.required : false })}
                          className={`form-input ${errors.partnerFirstName ? 'error' : ''}`}
                          placeholder={ff.partnerFirstName}
                          autoComplete="off"
                        />
                      </Field>
                      <Field label={ff.partnerLastName} error={errors.partnerLastName?.message}>
                        <input
                          {...register('partnerLastName', { required: hasPartner === 'yes' ? f.required : false })}
                          className={`form-input ${errors.partnerLastName ? 'error' : ''}`}
                          placeholder={ff.partnerLastName}
                          autoComplete="off"
                        />
                      </Field>
                    </div>
                    <Field label={ff.partnerDietary} className="mb-0">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {(Object.entries(f.dietaryOptions) as [string, string][]).map(([val, label]) => (
                          <label key={val} className="flex items-center gap-2 cursor-pointer group">
                            <input
                              {...register('partnerDietary')}
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
                    {partnerDietary === 'other' && (
                      <Field label="" className="mt-3">
                        <input
                          {...register('partnerDietaryOther')}
                          className="form-input"
                          placeholder={f.dietaryOtherPlaceholder}
                        />
                      </Field>
                    )}
                  </div>
                )}
              </div>

              {/* ── Children ── */}
              <div className="border-t border-cream/60 pt-6 mt-2 mb-4">
                <Field label={ff.hasChildren} className="mb-4">
                  <div className="flex gap-4">
                    {(['yes', 'no'] as const).map((val) => (
                      <label key={val} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          {...register('hasChildren')}
                          type="radio"
                          value={val}
                          className="w-4 h-4 accent-champagne"
                        />
                        <span className="font-body text-sm text-darkText group-hover:text-champagne transition-colors">
                          {val === 'yes' ? ff.partnerYes : ff.partnerNo}
                        </span>
                      </label>
                    ))}
                  </div>
                </Field>

                {hasChildren === 'yes' && (
                  <div className="bg-white/60 border border-cream/60 p-4 md:p-6 mt-2">
                    <p className="font-serif-display text-base text-champagne mb-1">{ff.childrenSection}</p>
                    <p className="font-body text-xs text-lightText italic mb-4">{ff.childrenNote}</p>

                    {childFields.map((field, index) => (
                      <div key={field.id} className="flex items-end gap-3 mb-3">
                        <div className="flex-1 grid grid-cols-2 gap-3">
                          <Field
                            label={`${ff.childName} ${index + 1}`}
                            error={(errors.children?.[index] as any)?.name?.message}
                          >
                            <input
                              {...register(`children.${index}.name`, { required: f.required })}
                              className={`form-input ${(errors.children?.[index] as any)?.name ? 'error' : ''}`}
                              placeholder={ff.childName}
                            />
                          </Field>
                          <Field label={ff.childAge}>
                            <select
                              {...register(`children.${index}.age`)}
                              className="form-input bg-white"
                              defaultValue=""
                            >
                              <option value="" disabled>{ff.childAgeSelect}</option>
                              {Array.from({ length: 18 }, (_, i) => (
                                <option key={i} value={String(i)}>{i}</option>
                              ))}
                            </select>
                          </Field>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeChild(index)}
                          className="mb-0.5 text-xs text-lightText hover:text-red-400 transition-colors font-body uppercase tracking-wider whitespace-nowrap"
                        >
                          {ff.removeChild}
                        </button>
                      </div>
                    ))}

                    {childFields.length < 6 && (
                      <button
                        type="button"
                        onClick={() => appendChild({ name: '', age: '' })}
                        className="mt-2 text-sm font-body text-champagne hover:text-darkText transition-colors border border-champagne/50 hover:border-champagne px-4 py-2 tracking-wider uppercase"
                      >
                        + {ff.addChild}
                      </button>
                    )}
                  </div>
                )}
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
      )}
    </div>
  )
}

function Field({
  label,
  error,
  children,
  className = '',
}: {
  label: React.ReactNode
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
