import Link from 'next/link'
import {icon, LatLngExpression} from 'leaflet'
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'
import {getAverageValue} from 'lib/utils'
import {PictureOnMap} from 'types/gallery'
import 'leaflet/dist/leaflet.css'
import {memo} from 'react'

const arePropsEqual = () => true

function Map({pictures, zoom = 5}: MapProps) {
  const latitudes = pictures.map(({coordinates}) => coordinates.latitude)
  const longitudes = pictures.map(({coordinates}) => coordinates.longitude)
  const center = [
    getAverageValue(latitudes),
    getAverageValue(longitudes)
  ] as LatLngExpression

  return (
    <MapContainer
      key={new Date().getTime()}
      className="h-full w-full"
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pictures.map(({name, url, css, slug, coordinates}) => (
        <Marker
          key={slug}
          icon={icon({
            iconUrl:
              'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzUyNTI1MiI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTEuNTQgMjIuMzUxbC4wNy4wNC4wMjguMDE2YS43Ni43NiAwIDAwLjcyMyAwbC4wMjgtLjAxNS4wNzEtLjA0MWExNi45NzUgMTYuOTc1IDAgMDAxLjE0NC0uNzQyIDE5LjU4IDE5LjU4IDAgMDAyLjY4My0yLjI4MmMxLjk0NC0xLjk5IDMuOTYzLTQuOTggMy45NjMtOC44MjdhOC4yNSA4LjI1IDAgMDAtMTYuNSAwYzAgMy44NDYgMi4wMiA2LjgzNyAzLjk2MyA4LjgyN2ExOS41OCAxOS41OCAwIDAwMi42ODIgMi4yODIgMTYuOTc1IDE2Ljk3NSAwIDAwMS4xNDUuNzQyek0xMiAxMy41YTMgMyAwIDEwMC02IDMgMyAwIDAwMCA2eiIgY2xpcC1ydWxlPSJldmVub2RkIiAvPjwvc3ZnPg==',
            iconSize: [30, 30],
            className: 'drop-shadow-sm'
          })}
          position={[coordinates.latitude, coordinates.longitude]}
          interactive={url && name && css ? true : false}
        >
          {url && name && css && (
            <Popup
              closeButton={false}
              className="ml-[.5px] [&>div:first-child>div]:!m-0 [&>div:first-child>div]:!p-3 [&>div:first-child]:!rounded-xl [&>div:first-child]:bg-gradient-to-b [&>div:first-child]:!from-neutral-300 [&>div:first-child]:!via-transparent [&>div:first-child]:!font-bold [&>div:first-child]:!text-neutral-600 [&>div>div>a:hover]:!underline [&>div>div>a]:!text-neutral-600"
            >
              <Link href={url} title={name} className="flex items-center">
                <div className="mr-1.5 aspect-square overflow-hidden rounded">
                  <div
                    style={{
                      ...css,
                      transform: 'translate3d(0, 0, 0)'
                    }}
                    className="h-6 w-6 blur"
                  />
                </div>

                {name}
              </Link>
            </Popup>
          )}
        </Marker>
      ))}
    </MapContainer>
  )
}

interface MapProps {
  pictures: PictureOnMap[]
  zoom?: number
}

export default memo(Map, arePropsEqual)
