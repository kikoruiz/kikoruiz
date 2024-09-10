import {memo} from 'react'
import {LatLngExpression} from 'leaflet'
import {MapContainer, TileLayer} from 'react-leaflet'
import {useMediaQuery} from 'react-responsive'
import {getAverageValue, screens} from 'lib/utils'
import MapPicture from './map-picture'
import {PictureOnMap} from 'types/gallery'

import 'leaflet/dist/leaflet.css'

const arePropsEqual = () => true

function Map({pictures, zoom = 5, isInteractive}: MapProps) {
  const {sm} = screens
  const isDesktopOrLaptop = useMediaQuery({minWidth: sm})
  const latitudes = pictures.map(({coordinates}) => coordinates.latitude)
  const longitudes = pictures.map(({coordinates}) => coordinates.longitude)
  const center = [
    getAverageValue(latitudes),
    getAverageValue(longitudes)
  ] as LatLngExpression

  return (
    <MapContainer
      key={new Date().getTime()}
      className="h-full w-full [&>div:last-child>div:first-child>div]:rounded-xl [&>div:last-child>div:first-child>div]:border-2 [&>div:last-child>div:first-child>div>a]:font-sans [&>div:last-child>div:first-child>div>a]:font-normal [&>div:last-child>div:first-child>div>a]:text-neutral-600 [&>div:last-child>div:first-child>div>a:first-child]:rounded-t-xl [&>div:last-child>div:first-child>div>a:last-child]:rounded-b-xl"
      center={center}
      zoom={zoom}
      zoomControl={isDesktopOrLaptop}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pictures.map(({slug, coordinates, image}) => (
        <MapPicture
          key={slug}
          slug={slug}
          coordinates={coordinates}
          image={image}
          isInteractive={isInteractive}
        />
      ))}
    </MapContainer>
  )
}

interface MapProps {
  pictures: PictureOnMap[]
  zoom?: number
  isInteractive?: boolean
}

export default memo(Map, arePropsEqual)
