import {icon, LatLngExpression} from 'leaflet'
import {MapContainer, TileLayer, Marker} from 'react-leaflet'
import useTranslation from 'next-translate/useTranslation'
import {getAverageValue, getSlug} from 'lib/utils'
import {RawPicture} from 'types/gallery'
import 'leaflet/dist/leaflet.css'

export default function Map({pictures, setShowMap}: MapProps) {
  const {t} = useTranslation()
  const latitudes = pictures.map(({coordinates}) => coordinates.latitude)
  const longitudes = pictures.map(({coordinates}) => coordinates.longitude)
  const center = [
    getAverageValue(latitudes),
    getAverageValue(longitudes)
  ] as LatLngExpression

  function handleMapClose() {
    setShowMap(false)
  }

  return (
    <div className="fixed inset-0 z-10 h-screen w-screen">
      <button
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 z-0 h-full w-full touch-auto bg-neutral-900/60 backdrop-blur transition-opacity"
        onClick={handleMapClose}
      ></button>

      <div className="container absolute inset-0 mx-auto overflow-hidden sm:top-[6rem] sm:max-h-[calc(100%-12rem)]">
        <button
          aria-label={t('map.close')}
          title={t('map.close')}
          className="group absolute top-3 right-3 z-[500] flex h-11 w-11 rounded-full border-2 border-neutral-900/40 bg-gradient-to-t from-neutral-100 to-neutral-200 text-neutral-900/80 hover:to-neutral-300 hover:text-neutral-900 focus:outline-none sm:top-4 sm:right-4"
          onClick={handleMapClose}
        >
          <span className="sr-only">{t('map.close')}</span>
          <div className="absolute left-1/2 top-1/2 w-5 -translate-x-1/2 -translate-y-1/2 transform">
            <span
              aria-hidden="true"
              className="absolute flex h-0.5 w-5 rotate-45 transform bg-current group-hover:bg-current"
            ></span>
            <span
              aria-hidden="true"
              className="absolute flex h-0.5 w-5 -rotate-45 transform bg-current group-hover:bg-current"
            ></span>
          </div>
        </button>

        <MapContainer
          key={new Date().getTime()}
          className="h-full w-full drop-shadow-xl sm:rounded-lg"
          center={center}
          zoom={5}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {pictures.map(({title, coordinates}) => (
            <Marker
              key={getSlug(title)}
              icon={icon({
                iconUrl:
                  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmNzg0OSI+CiAgPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTEuNTQgMjIuMzUxbC4wNy4wNC4wMjguMDE2YS43Ni43NiAwIDAwLjcyMyAwbC4wMjgtLjAxNS4wNzEtLjA0MWExNi45NzUgMTYuOTc1IDAgMDAxLjE0NC0uNzQyIDE5LjU4IDE5LjU4IDAgMDAyLjY4My0yLjI4MmMxLjk0NC0xLjk5IDMuOTYzLTQuOTggMy45NjMtOC44MjdhOC4yNSA4LjI1IDAgMDAtMTYuNSAwYzAgMy44NDYgMi4wMiA2LjgzNyAzLjk2MyA4LjgyN2ExOS41OCAxOS41OCAwIDAwMi42ODIgMi4yODIgMTYuOTc1IDE2Ljk3NSAwIDAwMS4xNDUuNzQyek0xMiAxMy41YTMgMyAwIDEwMC02IDMgMyAwIDAwMCA2eiIgY2xpcC1ydWxlPSJldmVub2RkIiAvPgo8L3N2Zz4=',
                iconSize: [30, 30],
                className: 'drop-shadow-sm'
              })}
              position={[coordinates.latitude, coordinates.longitude]}
            />
          ))}
        </MapContainer>
      </div>
    </div>
  )
}

interface MapProps {
  pictures: RawPicture[]
  setShowMap: (showMap: boolean) => void
}
