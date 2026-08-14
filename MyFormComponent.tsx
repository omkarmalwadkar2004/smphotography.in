'use client'

import React, { useEffect, useState } from 'react'

interface MyFormComponentProps {
  formId: string
}

const MyFormComponent = ({ formId }: MyFormComponentProps) => {
  const [cmsForm, setCmsForm] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState<boolean>(false)

  // Fetch Form Schema
  useEffect(() => {
    if (!formId) return

    setLoading(true)
    fetch(`/api/forms/${formId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch form')
        return res.json()
      })
      .then((data) => {
        if (data.errors && data.errors.length > 0) {
          throw new Error(data.errors[0].message || 'Error fetching form')
        }
        const formDoc = data.docs ? data.docs[0] : data
        setCmsForm(formDoc)
        setLoading(false)
      })
      .catch((err: any) => {
        console.error(err)
        setError(typeof err === 'string' ? err : err.message || 'Error loading form')
        setLoading(false)
      })
  }, [formId])

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const submissionData = cmsForm?.fields?.map((field: any) => ({
      field: field.name,
      value: formData.get(field.name) || '',
    }))

    try {
      const res = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form: formId,
          submissionData,
        }),
      })

      if (res.ok) {
        setSubmitted(true)
      } else {
        setError('Failed to submit form.')
      }
    } catch (err: any) {
      console.error(err)
      setError('Error submitting form.')
    }
  }

  // Safe string renderer helper
  const renderText = (value: any, fallback: string = '') => {
    if (typeof value === 'string') return value
    if (typeof value === 'number') return String(value)
    return fallback
  }

  // Pure Inline CSS Objects
  const containerStyle: React.CSSProperties = {
    maxWidth: '480px',
    margin: '32px auto',
    padding: '32px',
    backgroundColor: '#c8c2c2',
    borderRadius: '16px',
    border: '1px solid #eaecf0',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    color: '#101828',
    boxSizing: 'border-box',
  }

  const headingStyle: React.CSSProperties = {
    fontSize: '22px',
    fontWeight: '700',
    marginBottom: '24px',
    color: '#101828',
    letterSpacing: '-0.02em',
  }

  const fieldContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '18px',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#344054',
    marginBottom: '6px',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #d0d5dd',
    backgroundColor: '#f9fafb',
    fontSize: '14px',
    color: '#101828',
    outline: 'none',
    boxSizing: 'border-box',
  }

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 20px',
    borderRadius: '8px',
    backgroundColor: '#000000',
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '14px',
    border: 'none',
    cursor: 'pointer',
    marginTop: '8px',
  }

  const cardSuccessStyle: React.CSSProperties = {
    maxWidth: '480px',
    margin: '32px auto',
    padding: '28px',
    backgroundColor: '#ecfdf5',
    border: '1px solid #a7f3d0',
    borderRadius: '16px',
    textAlign: 'center',
    color: '#065f46',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  }

  const cardErrorStyle: React.CSSProperties = {
    maxWidth: '480px',
    margin: '32px auto',
    padding: '16px 20px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '12px',
    color: '#991b1b',
    fontSize: '14px',
    fontWeight: '500',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  }

  // 1. Loading State
  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '24px 0', color: '#667085', fontSize: '14px' }}>
          Loading form...
        </div>
      </div>
    )
  }

  // 2. Error State
  if (error) {
    return <div style={cardErrorStyle}>⚠️ {String(error)}</div>
  }

  // 3. Success State
  if (submitted) {
    return (
      <div style={cardSuccessStyle}>
        <div
          style={{
            width: '48px',
            height: '48px',
            backgroundColor: '#10b981',
            color: '#ffffff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            fontWeight: 'bold',
            fontSize: '20px',
          }}
        >
          ✓
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 6px' }}>Thank You!</h3>
        <p style={{ margin: 0, fontSize: '14px', color: '#047857' }}>
          {renderText(cmsForm?.confirmationMessage, 'Your form has been successfully submitted.')}
        </p>
      </div>
    )
  }

  if (!cmsForm || !Array.isArray(cmsForm.fields)) {
    return <div style={cardErrorStyle}>No form schema found for ID: {formId}</div>
  }

  // 4. Form View
  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>{renderText(cmsForm.title, 'Contact Us')}</h2>

      <form onSubmit={handleSubmit}>
        {cmsForm.fields.map((field: any) => {
          const { id, blockType, name, required } = field
          const label = renderText(field.label, name)

          if (blockType === 'message') {
            return (
              <div
                key={id}
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#475467',
                  marginBottom: '18px',
                  border: '1px solid #f2f4f7',
                }}
              >
                {renderText(field.message, '')}
              </div>
            )
          }

          return (
            <div key={id || name} style={fieldContainerStyle}>
              <label htmlFor={name} style={labelStyle}>
                {label} {required && <span style={{ color: '#f04438' }}>*</span>}
              </label>

              {blockType === 'textarea' ? (
                <textarea
                  id={name}
                  name={name}
                  rows={4}
                  required={required}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  placeholder={`Enter ${label.toLowerCase()}...`}
                />
              ) : blockType === 'select' ? (
                <select id={name} name={name} required={required} style={inputStyle}>
                  <option value="">Select an option</option>
                  {field.options?.map((opt: any, i: number) => (
                    <option key={i} value={opt.value}>
                      {renderText(opt.label, opt.value)}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={name}
                  type={
                    blockType === 'number' ? 'number' : blockType === 'email' ? 'email' : 'text'
                  }
                  name={name}
                  required={required}
                  style={inputStyle}
                  placeholder={`Enter ${label.toLowerCase()}...`}
                />
              )}
            </div>
          )
        })}

        <button type="submit" style={buttonStyle}>
          {renderText(cmsForm.submitButtonLabel, 'Submit')}
        </button>
      </form>
    </div>
  )
}

export default MyFormComponent
