import { useId, useState } from 'react';

export function AccountTypeSwitch({ value = 'cliente', onChange }) {
  return (
    <div
      className="af-type-switch"
      data-selected={value}
      role="group"
      aria-label="Tipo de conta"
    >
      <span
        className="af-type-switch__glider"
        style={{
          transform:
            value === 'empresa'
              ? 'translate3d(100%, 0, 0)'
              : 'translate3d(0%, 0, 0)',
        }}
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={() => onChange('cliente')}
        aria-pressed={value === 'cliente'}
        className="af-type-switch__btn"
      >
        Cliente
      </button>

      <button
        type="button"
        onClick={() => onChange('empresa')}
        aria-pressed={value === 'empresa'}
        className="af-type-switch__btn"
      >
        Empresa
      </button>
    </div>
  );
}

export function AuthInput({
  label,
  type = 'text',
  value = '',
  onChange,
  onBlur,
  placeholder,
  autoComplete,
  inputMode,
  maxLength,
  error,
  disabled = false,
}) {
  const id = useId();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const isFilled = String(value).length > 0;

  return (
    <div
      className={`af-field ${isFocused ? 'af-field--focused' : ''} ${
        error ? 'af-field--error' : ''
      }`}
    >
      <label htmlFor={id} className="af-field__label">
        {label}
      </label>

      <div className="af-field__box">
        <input
          id={id}
          type={resolvedType}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            if (onBlur) onBlur(e);
          }}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          disabled={disabled}
          data-filled={isFilled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`af-field__input ${
            isPassword ? 'af-field__input--password' : ''
          }`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="af-field__toggle-pw"
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            aria-pressed={showPassword}
          >
            {showPassword ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            )}
          </button>
        )}

        <span className="af-field__line" aria-hidden="true" />
      </div>

      {error && (
        <span id={`${id}-error`} className="af-field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export function AuthSelect({
  label,
  value = '',
  onChange,
  onBlur,
  placeholder = 'Selecione',
  error,
  disabled = false,
  children,
}) {
  const id = useId();
  const [isFocused, setIsFocused] = useState(false);
  const isFilled = String(value).length > 0;

  return (
    <div
      className={`af-field ${isFocused ? 'af-field--focused' : ''} ${
        error ? 'af-field--error' : ''
      }`}
    >
      <label htmlFor={id} className="af-field__label">
        {label}
      </label>

      <div className="af-field__box">
        <select
          id={id}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            if (onBlur) onBlur(e);
          }}
          disabled={disabled}
          data-filled={isFilled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="af-field__input af-field__select"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {children}
        </select>

        <span className="af-field__line" aria-hidden="true" />
      </div>

      {error && (
        <span id={`${id}-error`} className="af-field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export function PasswordStrengthMeter({ password = '' }) {
  const isOpen = password.length > 0;

  const hasMinLen = password.length >= 6;
  const hasLettersAndNumbers = /[A-Za-z]/.test(password) && /\d/.test(password);
  const hasUpperOrSymbol = /[A-Z]/.test(password) || /[^A-Za-z0-9]/.test(password);

  const score = [hasMinLen, hasLettersAndNumbers, hasUpperOrSymbol].filter(Boolean).length;
  const level = score <= 1 ? 'weak' : score === 2 ? 'medium' : 'strong';
  const levelLabel = score <= 1 ? 'Fraca' : score === 2 ? 'Média' : 'Forte';

  const hint = !hasMinLen
    ? 'mínimo 6 caracteres'
    : !hasLettersAndNumbers
      ? 'combine letras e números'
      : !hasUpperOrSymbol
        ? 'adicione maiúscula ou símbolo'
        : 'pronta para uso';

  return (
    <div className={`af-collapse ${isOpen ? 'af-collapse--open' : ''}`} aria-hidden={!isOpen}>
      <div className="af-collapse__inner">
        {isOpen && (
          <div className="af-pw-inline" aria-live="polite">
            <div className="af-pw-inline__bars" aria-hidden="true">
              <span className={`af-pw-inline__bar af-pw-inline__bar--${level}`} />
              <span
                className={`af-pw-inline__bar ${
                  score >= 2 ? `af-pw-inline__bar--${level}` : ''
                }`}
              />
              <span
                className={`af-pw-inline__bar ${
                  score >= 3 ? `af-pw-inline__bar--${level}` : ''
                }`}
              />
            </div>
            <p className="af-pw-inline__caption">
              Força: <strong>{levelLabel}</strong> · {hint}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}