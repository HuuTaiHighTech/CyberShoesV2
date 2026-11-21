export const PASSWORD_RULES = [
  { id: 'number', re: /[0-9]/, label: 'Chứa ít nhất 1 chữ số (0-9)' },
  { id: 'lowercase', re: /[a-z]/, label: 'Chứa ít nhất 1 chữ thường (a-z)' },
  { id: 'uppercase', re: /[A-Z]/, label: 'Chứa ít nhất 1 chữ in hoa (A-Z)' },
  {
    id: 'special',
    re: /[$&+,:;=?@#|'<>.^*()%!-]/,
    label: 'Chứa ít nhất 1 ký tự đặc biệt (!@#$...)',
  },
  { id: 'length', re: /^.{6,}$/, label: 'Độ dài tối thiểu từ 6 ký tự trở lên' },
]

export const getPasswordRuleResults = (password = '') =>
  PASSWORD_RULES.map((rule) => ({
    ...rule,
    passed: rule.re.test(password),
  }))
