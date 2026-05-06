/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary:      'var(--color-primary)',
        'primary-lt': 'var(--color-primary-light)',
        'primary-dk': 'var(--color-primary-dark)',
        'primary-bg': 'var(--color-primary-bg)',
        surface:      'var(--color-surface)',
        's2':         'var(--color-surface-2)',
        border:       'var(--color-border)',
        't1':         'var(--color-text-primary)',
        't2':         'var(--color-text-secondary)',
        'toff':       'var(--color-text-disabled)',
        success:      'var(--color-success)',
        'success-bg': 'var(--color-success-bg)',
        danger:       'var(--color-danger)',
        'danger-bg':  'var(--color-danger-bg)',
        bg:           'var(--color-background)',
      },
      borderRadius: {
        sm:   'var(--radius-sm)',
        DEFAULT: 'var(--radius-md)',
        md:   'var(--radius-md)',
        lg:   'var(--radius-lg)',
        xl:   'var(--radius-xl)',
        full: 'var(--radius-full)',
      },
      fontFamily: {
        sans: ['Heebo', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 12px rgba(29, 78, 216, 0.08)',
        btn:  '0 2px 8px rgba(29, 78, 216, 0.25)',
      },
    },
  },
  plugins: [],
}

