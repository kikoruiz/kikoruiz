import defaultTheme from 'tailwindcss/defaultTheme'
import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./pages/**/*.{js,tsx}', './components/**/*.{js,tsx}'],
  theme: {
    screens: {
      ...defaultTheme.screens,
      '2xl': defaultTheme.screens.xl
    },
    fontFamily: {
      sans: ['var(--font-inter)'],
      serif: ['Merriweather', 'serif']
    },
    extend: {
      height: {
        screen: ['100vh', '100dvh']
      },
      backgroundImage: {
        'personal-info-phone':
          "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2Q0ZDRkNCI+CiAgPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMS41IDQuNWEzIDMgMCAwMTMtM2gxLjM3MmMuODYgMCAxLjYxLjU4NiAxLjgxOSAxLjQybDEuMTA1IDQuNDIzYTEuODc1IDEuODc1IDAgMDEtLjY5NCAxLjk1NWwtMS4yOTMuOTdjLS4xMzUuMTAxLS4xNjQuMjQ5LS4xMjYuMzUyYTExLjI4NSAxMS4yODUgMCAwMDYuNjk3IDYuNjk3Yy4xMDMuMDM4LjI1LjAwOS4zNTItLjEyNmwuOTctMS4yOTNhMS44NzUgMS44NzUgMCAwMTEuOTU1LS42OTRsNC40MjMgMS4xMDVjLjgzNC4yMDkgMS40Mi45NTkgMS40MiAxLjgyVjE5LjVhMyAzIDAgMDEtMyAzaC0yLjI1QzguNTUyIDIyLjUgMS41IDE1LjQ0OCAxLjUgNi43NVY0LjV6IiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIC8+Cjwvc3ZnPg==')",
        'personal-info-email':
          "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2Q0ZDRkNCI+CiAgPHBhdGggZD0iTTEuNSA4LjY3djguNThhMyAzIDAgMDAzIDNoMTVhMyAzIDAgMDAzLTNWOC42N2wtOC45MjggNS40OTNhMyAzIDAgMDEtMy4xNDQgMEwxLjUgOC42N3oiIC8+CiAgPHBhdGggZD0iTTIyLjUgNi45MDhWNi43NWEzIDMgMCAwMC0zLTNoLTE1YTMgMyAwIDAwLTMgM3YuMTU4bDkuNzE0IDUuOTc4YTEuNSAxLjUgMCAwMDEuNTcyIDBMMjIuNSA2LjkwOHoiIC8+Cjwvc3ZnPg==')",
        'personal-info-location':
          "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2Q0ZDRkNCI+CiAgPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTEuNTQgMjIuMzUxbC4wNy4wNC4wMjguMDE2YS43Ni43NiAwIDAwLjcyMyAwbC4wMjgtLjAxNS4wNzEtLjA0MWExNi45NzUgMTYuOTc1IDAgMDAxLjE0NC0uNzQyIDE5LjU4IDE5LjU4IDAgMDAyLjY4My0yLjI4MmMxLjk0NC0xLjk5IDMuOTYzLTQuOTggMy45NjMtOC44MjdhOC4yNSA4LjI1IDAgMDAtMTYuNSAwYzAgMy44NDYgMi4wMiA2LjgzNyAzLjk2MyA4LjgyN2ExOS41OCAxOS41OCAwIDAwMi42ODIgMi4yODIgMTYuOTc1IDE2Ljk3NSAwIDAwMS4xNDUuNzQyek0xMiAxMy41YTMgMyAwIDEwMC02IDMgMyAwIDAwMCA2eiIgY2xpcC1ydWxlPSJldmVub2RkIiAvPgo8L3N2Zz4=')",
        'personal-info-birthday':
          "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2Q0ZDRkNCI+CiAgPHBhdGggZD0iTTEyLjc1IDEyLjc1YS43NS43NSAwIDExLTEuNSAwIC43NS43NSAwIDAxMS41IDB6TTcuNSAxNS43NWEuNzUuNzUgMCAxMDAtMS41Ljc1Ljc1IDAgMDAwIDEuNXpNOC4yNSAxNy4yNWEuNzUuNzUgMCAxMS0xLjUgMCAuNzUuNzUgMCAwMTEuNSAwek05Ljc1IDE1Ljc1YS43NS43NSAwIDEwMC0xLjUuNzUuNzUgMCAwMDAgMS41ek0xMC41IDE3LjI1YS43NS43NSAwIDExLTEuNSAwIC43NS43NSAwIDAxMS41IDB6TTEyIDE1Ljc1YS43NS43NSAwIDEwMC0xLjUuNzUuNzUgMCAwMDAgMS41ek0xMi43NSAxNy4yNWEuNzUuNzUgMCAxMS0xLjUgMCAuNzUuNzUgMCAwMTEuNSAwek0xNC4yNSAxNS43NWEuNzUuNzUgMCAxMDAtMS41Ljc1Ljc1IDAgMDAwIDEuNXpNMTUgMTcuMjVhLjc1Ljc1IDAgMTEtMS41IDAgLjc1Ljc1IDAgMDExLjUgMHpNMTYuNSAxNS43NWEuNzUuNzUgMCAxMDAtMS41Ljc1Ljc1IDAgMDAwIDEuNXpNMTUgMTIuNzVhLjc1Ljc1IDAgMTEtMS41IDAgLjc1Ljc1IDAgMDExLjUgMHpNMTYuNSAxMy41YS43NS43NSAwIDEwMC0xLjUuNzUuNzUgMCAwMDAgMS41eiIgLz4KICA8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik02Ljc1IDIuMjVBLjc1Ljc1IDAgMDE3LjUgM3YxLjVoOVYzQS43NS43NSAwIDAxMTggM3YxLjVoLjc1YTMgMyAwIDAxMyAzdjExLjI1YTMgMyAwIDAxLTMgM0g1LjI1YTMgMyAwIDAxLTMtM1Y3LjVhMyAzIDAgMDEzLTNINlYzYS43NS43NSAwIDAxLjc1LS43NXptMTMuNSA5YTEuNSAxLjUgMCAwMC0xLjUtMS41SDUuMjVhMS41IDEuNSAwIDAwLTEuNSAxLjV2Ny41YTEuNSAxLjUgMCAwMDEuNSAxLjVoMTMuNWExLjUgMS41IDAgMDAxLjUtMS41di03LjV6IiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIC8+Cjwvc3ZnPg==')",
        select:
          "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2Q0ZDRkNCI+CiAgPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTEuNDcgNC43MmEuNzUuNzUgMCAwMTEuMDYgMGwzLjc1IDMuNzVhLjc1Ljc1IDAgMDEtMS4wNiAxLjA2TDEyIDYuMzEgOC43OCA5LjUzYS43NS43NSAwIDAxLTEuMDYtMS4wNmwzLjc1LTMuNzV6bS0zLjc1IDkuNzVhLjc1Ljc1IDAgMDExLjA2IDBMMTIgMTcuNjlsMy4yMi0zLjIyYS43NS43NSAwIDExMS4wNiAxLjA2bC0zLjc1IDMuNzVhLjc1Ljc1IDAgMDEtMS4wNiAwbC0zLjc1LTMuNzVhLjc1Ljc1IDAgMDEwLTEuMDZ6IiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIC8+Cjwvc3ZnPgo=')"
      },
      aspectRatio: {
        '3/2': '3 / 2',
        '2/3': '2 / 3',
        '4/3': '4 / 3',
        '3/4': '3 / 4',
        '5/4': '5 / 4',
        '4/5': '4 / 5',
        '5/3': '5 / 3',
        '3/5': '3 / 5',
        '16/9': '16 / 9',
        '9/16': '9 / 16',
        '16/10': '16 / 10',
        '2/1': '2 / 1'
      }
    }
  },
  plugins: [typography],
  future: {
    hoverOnlyWhenSupported: true
  }
}

export default config
