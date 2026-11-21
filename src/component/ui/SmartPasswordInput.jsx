import { useEffect, useState } from 'react'
import {
  getPasswordRuleResults,
  PASSWORD_RULES,
} from '../../util/passwordRules'
import './SmartPasswordInput.css'

const SmartPasswordInput = ({
  id,
  name,
  value = '',
  onChange,
  onBlur,
  onFocus,
  autoComplete,
  placeholder,
  className = '',
  showStrength = false,
  ...inputProps
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isOpened, setIsOpened] = useState(false)
  const ruleResults = getPasswordRuleResults(value)
  const passedCount = ruleResults.filter((rule) => rule.passed).length
  const strength = Math.round((passedCount / PASSWORD_RULES.length) * 100)
  const strengthColor =
    strength <= 40 ? '#fa5252' : strength < 100 ? '#fd7e14' : '#12b886'
  const requirementsId = `${id}-requirements`
  const describedBy = [
    inputProps['aria-describedby'],
    showStrength && isOpened ? requirementsId : null,
  ]
    .filter(Boolean)
    .join(' ')

  useEffect(() => {
    if (!showStrength || !isOpened || strength !== 100) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => setIsOpened(false), 300)
    return () => window.clearTimeout(timeoutId)
  }, [isOpened, showStrength, strength])

  return (
    <div className="smart-password-input">
      <input
        {...inputProps}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={(event) => {
          if (showStrength) {
            setIsOpened(true)
          }
          onFocus?.(event)
        }}
        onBlur={(event) => {
          setIsOpened(false)
          onBlur?.(event)
        }}
        type={showPassword ? 'text' : 'password'}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={`smart-password-control ${className}`.trim()}
        aria-describedby={describedBy || undefined}
      />
      <button
        className="smart-password-toggle"
        type="button"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => setShowPassword((visible) => !visible)}
        aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
        aria-pressed={showPassword}
      >
        <i
          className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
          aria-hidden="true"
        />
      </button>
      {showStrength && isOpened && (
        <div
          className="smart-password-requirements"
          id={requirementsId}
          aria-live="polite"
        >
          <div className="smart-password-strength">
            <div
              className="smart-password-strength-bar"
              role="progressbar"
              aria-label="Độ mạnh mật khẩu"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={strength}
            >
              <span
                style={{
                  width: `${strength}%`,
                  backgroundColor: strengthColor,
                }}
              />
            </div>
            <span className="smart-password-strength-label">
              {strength === 100
                ? 'Mạnh'
                : strength > 40
                  ? 'Trung bình'
                  : 'Yếu'}
            </span>
          </div>
          <ul className="smart-password-rule-list">
            {ruleResults.map((rule) => (
              <li
                className={
                  rule.passed
                    ? 'smart-password-rule smart-password-rule--passed'
                    : 'smart-password-rule'
                }
                key={rule.id}
              >
                <i
                  className={`fa-solid ${rule.passed ? 'fa-check' : 'fa-xmark'}`}
                  aria-hidden="true"
                />
                <span>{rule.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default SmartPasswordInput
