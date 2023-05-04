import {memo} from 'react'
import {LatLngExpression} from 'leaflet'
import {MapContainer, TileLayer} from 'react-leaflet'
import {getAverageValue} from 'lib/utils'
import MapPicture from './map-picture'
import {Picture, PictureOnMap} from 'types/gallery'

import 'leaflet/dist/leaflet.css'

const arePropsEqual = () => true

function Map({pictures, zoom = 5, isInteractive, setPictureToView}: MapProps) {
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
          setPictureToView={setPictureToView}
        />
      ))}
    </MapContainer>
  )
}

interface MapProps {
  pictures: PictureOnMap[]
  zoom?: number
  isInteractive?: boolean
  setPictureToView?: (picture: Picture) => void
}

export default memo(Map, arePropsEqual)
