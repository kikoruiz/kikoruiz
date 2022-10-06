/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.js', './components/**/*.js'],
  theme: {
    fontFamily: {
      sans: [
        'Raleway',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Oxygen',
        'Ubuntu',
        'Cantarell',
        'Fira Sans',
        'Droid Sans',
        'Helvetica Neue',
        'sans-serif'
      ],
      serif: ['Merriweather', 'serif']
    },
    extend: {
      backgroundImage: {
        select:
          "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2Q0ZDRkOCI+CiAgPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTIuNTMgMTYuMjhhLjc1Ljc1IDAgMDEtMS4wNiAwbC03LjUtNy41YS43NS43NSAwIDAxMS4wNi0xLjA2TDEyIDE0LjY5bDYuOTctNi45N2EuNzUuNzUgMCAxMTEuMDYgMS4wNmwtNy41IDcuNXoiIGNsaXAtcnVsZT0iZXZlbm9kZCIgLz4KPC9zdmc+')"
      },
      aspectRatio: {
        '3/2': '3 / 2',
        '2/3': '2 / 3',
        '4/3': '4 / 3',
        '3/4': '3 / 4'
      }
    }
  },
  future: {
    hoverOnlyWhenSupported: true
  }
}
