import {icon, LatLngExpression} from 'leaflet'
import {MapContainer, TileLayer, Marker} from 'react-leaflet'
import {getAverageValue, getSlug} from 'lib/utils'
import {RawPicture} from 'types/gallery'
import 'leaflet/dist/leaflet.css'

export default function Map({pictures}: MapProps) {
  const latitudes = pictures.map(({coordinates}) => coordinates.latitude)
  const longitudes = pictures.map(({coordinates}) => coordinates.longitude)
  const center = [
    getAverageValue(latitudes),
    getAverageValue(longitudes)
  ] as LatLngExpression

  return (
    <MapContainer
      className="h-full w-full"
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
  )
}

interface MapProps {
  pictures: RawPicture[]
}
