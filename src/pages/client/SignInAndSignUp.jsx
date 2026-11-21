import { useFormik } from 'formik'
import { useDispatch } from 'react-redux'
import * as Yup from 'yup'
import { useMatch, useNavigate } from 'react-router-dom'
import SmartPasswordInput from '../../component/ui/SmartPasswordInput'
import { signIn, signUp } from '../../redux/apiSlice'
import { PASSWORD_RULES } from '../../util/passwordRules'

const signInSchema = Yup.object({
  email: Yup.string()
    .email('Email không hợp lệ')
    .required('Vui lòng nhập email'),
  password: Yup.string()
    .required('Vui lòng nhập mật khẩu'),
})

const signUpSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required('Vui lòng nhập họ và tên'),
  email: Yup.string()
    .email('Email không hợp lệ')
    .required('Vui lòng nhập email'),
  password: Yup.string()
    .test(
      'password-rules',
      'Mật khẩu chưa đủ điều kiện',
      (value) => !value || PASSWORD_RULES.every((rule) => rule.re.test(value)),
    )
    .required('Vui lòng nhập mật khẩu'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Mật khẩu xác nhận không khớp')
    .required('Vui lòng xác nhận mật khẩu'),
})

const SignInAndSignUp = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const registerMatch = useMatch('/register')
  const signUpMatch = useMatch('/sign-up')
  const isRegister = Boolean(registerMatch || signUpMatch)

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: isRegister ? signUpSchema : signInSchema,
    onSubmit: async (values, { setStatus }) => {
      setStatus(undefined)
      const requestData = isRegister
        ? {
            name: values.name.trim(),
            email: values.email.trim(),
            password: values.password,
          }
        : {
            email: values.email.trim(),
            password: values.password,
          }
      try {
        if (isRegister) {
          const message = await dispatch(signUp(requestData)).unwrap()
          setStatus({
            type: 'success',
            message,
          })
          return
        }

        await dispatch(signIn(requestData)).unwrap()
        navigate('/')
      } catch (error) {
        setStatus({
          type: 'error',
          message: `${isRegister ? 'Đăng ký' : 'Đăng nhập'} thất bại: ${error}`,
        })
      }
    },
  })

  const switchMode = () => {
    formik.resetForm()
    navigate(isRegister ? '/sign-in' : '/register')
  }

  const renderField = (name, label, options = {}) => {
    const error = formik.touched[name] && formik.errors[name]

    return (
      <div className="auth-field" key={name}>
        <label htmlFor={name}>{label}</label>
        {options.type === 'password' ? (
          <SmartPasswordInput
            {...formik.getFieldProps(name)}
            id={name}
            showStrength={options.showStrength}
            placeholder={options.placeholder}
            autoComplete={options.autoComplete}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${name}-error` : undefined}
          />
        ) : (
          <input
            {...formik.getFieldProps(name)}
            id={name}
            type={options.type || 'text'}
            placeholder={options.placeholder}
            autoComplete={options.autoComplete}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${name}-error` : undefined}
          />
        )}
        {error && (
          <span className="auth-field-error" id={`${name}-error`}>
            {error}
          </span>
        )}
      </div>
    )
  }

  return (
    <main className="auth-page">
      <style>{`
        .auth-page {
          --auth-ink: #172033;
          --auth-muted: #747d8e;
          --auth-accent: #ed6a3a;
          min-height: calc(100vh - 120px);
          display: grid;
          place-items: center;
          padding: 48px 20px;
          background: #f5f6f8;
          color: var(--auth-ink);
          font-family: inherit;
        }
        .auth-shell {
          width: min(100%, 980px);
          min-height: 570px;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          overflow: hidden;
          border-radius: 22px;
          background: #fff;
          box-shadow: 0 24px 70px rgba(23, 32, 51, 0.12);
        }
        .auth-aside {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 44px;
          color: #fff;
          background:
            radial-gradient(ellipse at 85% 20%, rgba(255,255,255,.16), transparent 34%),
            linear-gradient(145deg, #182338 5%, #293955 100%);
        }
        .auth-brand {
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 0.16em;
        }
        .auth-brand span { color: #ff956c; }
        .auth-aside-copy { margin: auto 0; padding: 44px 0; }
        .auth-kicker {
          margin: 0 0 14px;
          color: #ffad8b;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }
        .auth-aside h1 {
          max-width: 360px;
          margin: 0;
          font-size: clamp(32px, 4vw, 46px);
          line-height: 1.12;
        }
        .auth-aside-copy p:last-child {
          max-width: 340px;
          margin: 18px 0 0;
          color: #c5ccda;
          font-size: 15px;
          line-height: 1.7;
        }
        .auth-aside-foot {
          margin: 0;
          color: #aab4c5;
          font-size: 12px;
        }
        .auth-form-panel {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 56px clamp(28px, 6vw, 76px);
        }
        .auth-form-panel h2 {
          margin: 0;
          font-size: 30px;
          letter-spacing: -0.04em;
        }
        .auth-subtitle {
          margin: 9px 0 30px;
          color: var(--auth-muted);
          font-size: 14px;
        }
        .auth-form { display: grid; gap: 18px; }
        .auth-field { display: grid; gap: 8px; }
        .auth-field label {
          font-size: 13px;
          font-weight: 650;
        }
        .auth-field input {
          width: 100%;
          min-height: 48px;
          box-sizing: border-box;
          padding: 0 14px;
          border: 1px solid #dfe3e9;
          border-radius: 9px;
          outline: none;
          background: #fff;
          color: var(--auth-ink);
          font: inherit;
          font-size: 14px;
          transition: border-color .18s, box-shadow .18s;
        }
        .auth-field input::placeholder { color: #a7adba; }
        .auth-field input:focus {
          border-color: var(--auth-accent);
          box-shadow: 0 0 0 3px rgba(237, 106, 58, .12);
        }
        .auth-field input[aria-invalid="true"] { border-color: #d64545; }
        .auth-field-error { color: #c33838; font-size: 12px; }
        .auth-submit {
          min-height: 49px;
          margin-top: 4px;
          border: 0;
          border-radius: 9px;
          background: var(--auth-accent);
          color: #fff;
          cursor: pointer;
          font: inherit;
          font-size: 14px;
          font-weight: 700;
          transition: background .18s, transform .18s;
        }
        .auth-submit:hover { background: #d9582b; transform: translateY(-1px); }
        .auth-submit:focus-visible, .auth-switch:focus-visible {
          outline: 3px solid rgba(237, 106, 58, .35);
          outline-offset: 3px;
        }
        .auth-status {
          margin: 0;
          padding: 11px 12px;
          border-radius: 8px;
          background: #fff5e8;
          color: #80501c;
          font-size: 13px;
          line-height: 1.5;
        }
        .auth-status--success {
          background: #eaf7ef;
          color: #23643a;
        }
        .auth-status--error {
          background: #fff0ef;
          color: #a42e2e;
        }
        .auth-switch {
          align-self: center;
          margin: 24px 0 0;
          padding: 0;
          border: 0;
          background: transparent;
          color: var(--auth-muted);
          cursor: pointer;
          font: inherit;
          font-size: 13px;
        }
        .auth-switch strong { color: var(--auth-accent); }
        @media (max-width: 700px) {
          .auth-page { min-height: auto; padding: 28px 14px; }
          .auth-shell { grid-template-columns: 1fr; min-height: auto; }
          .auth-aside { min-height: 205px; padding: 26px; }
          .auth-aside-copy { padding: 30px 0 20px; }
          .auth-aside h1 { font-size: 32px; }
          .auth-aside-copy p:last-child { margin-top: 10px; }
          .auth-aside-foot { display: none; }
          .auth-form-panel { padding: 34px 26px 38px; }
        }
      `}</style>

      <section className="auth-shell" aria-label="Tài khoản CyberShoes">
        <aside className="auth-aside">
          <div className="auth-brand">CYBER<span>SHOES</span></div>
          <div className="auth-aside-copy">
            <p className="auth-kicker">Bước đi theo cách của bạn</p>
            <h1>Phong cách bắt đầu từ đôi giày phù hợp.</h1>
            <p>Đăng nhập hoặc tạo tài khoản để tiếp tục khám phá bộ sưu tập của chúng tôi.</p>
          </div>
          <p className="auth-aside-foot">© CyberShoes</p>
        </aside>

        <section className="auth-form-panel">
          <h2>{isRegister ? 'Tạo tài khoản' : 'Chào mừng trở lại'}</h2>
          <p className="auth-subtitle">
            {isRegister
              ? 'Điền thông tin để bắt đầu trải nghiệm CyberShoes.'
              : 'Đăng nhập bằng thông tin tài khoản của bạn.'}
          </p>

          <form className="auth-form" onSubmit={formik.handleSubmit} noValidate>
            {isRegister && renderField('name', 'Họ và tên', {
              placeholder: 'Nguyễn Văn A',
              autoComplete: 'name',
            })}
            {renderField('email', 'Email', {
              type: 'email',
              placeholder: 'email@example.com',
              autoComplete: 'email',
            })}
            {renderField('password', 'Mật khẩu', {
              type: 'password',
              placeholder: 'Tối thiểu 6 ký tự',
              autoComplete: isRegister ? 'new-password' : 'current-password',
              showStrength: isRegister,
            })}
            {isRegister && renderField('confirmPassword', 'Xác nhận mật khẩu', {
              type: 'password',
              placeholder: 'Nhập lại mật khẩu',
              autoComplete: 'new-password',
            })}

            {formik.status?.message && (
              <p
                className={`auth-status auth-status--${formik.status.type}`}
                role={formik.status.type === 'error' ? 'alert' : 'status'}
              >
                {formik.status.message}
              </p>
            )}

            <button className="auth-submit" type="submit" disabled={formik.isSubmitting}>
              {formik.isSubmitting
                ? 'Đang xử lý...'
                : isRegister
                  ? 'Tạo tài khoản'
                  : 'Đăng nhập'}
            </button>
          </form>

          <button className="auth-switch" type="button" onClick={switchMode}>
            {isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}{' '}
            <strong>{isRegister ? 'Đăng nhập' : 'Đăng ký'}</strong>
          </button>
        </section>
      </section>
    </main>
  )
}

export default SignInAndSignUp
