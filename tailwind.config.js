/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.js', './components/**/*.js'],
  theme: {
    fontFamily: {
      sans: [
        'Inter',
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
          "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2Q0ZDRkNCI+CiAgPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTEuNDcgNC43MmEuNzUuNzUgMCAwMTEuMDYgMGwzLjc1IDMuNzVhLjc1Ljc1IDAgMDEtMS4wNiAxLjA2TDEyIDYuMzEgOC43OCA5LjUzYS43NS43NSAwIDAxLTEuMDYtMS4wNmwzLjc1LTMuNzV6bS0zLjc1IDkuNzVhLjc1Ljc1IDAgMDExLjA2IDBMMTIgMTcuNjlsMy4yMi0zLjIyYS43NS43NSAwIDExMS4wNiAxLjA2bC0zLjc1IDMuNzVhLjc1Ljc1IDAgMDEtMS4wNiAwbC0zLjc1LTMuNzVhLjc1Ljc1IDAgMDEwLTEuMDZ6IiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIC8+Cjwvc3ZnPgo=')"
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
