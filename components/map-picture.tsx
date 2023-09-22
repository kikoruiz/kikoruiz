import {Dispatch, SetStateAction, useState} from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import {icon} from 'leaflet'
import {Popup, Marker} from 'react-leaflet'
import {REQUEST_STATUS_OPTIONS} from 'config'
import {fetcher} from 'lib/utils'
import {Coordinates, Image as ImageInterface, Picture} from 'types/gallery'
import Image from './image'

export default function MapPicture({
  slug,
  coordinates,
  image,
  isInteractive
}: MapPictureProps) {
  const {locale} = useRouter()
  const [picture, setPicture]: [
    Picture,
    Dispatch<SetStateAction<Picture | null>>
  ] = useState()
  const [, setStatus] = useState(REQUEST_STATUS_OPTIONS.IDLE)

  function handlePopupOpen(slug) {
    return async function () {
      setStatus(REQUEST_STATUS_OPTIONS.PENDING)
      let picture: Picture = null

      if (slug && locale) {
        try {
          picture = await fetcher.get(`/api/picture/${slug}?locale=${locale}`)

          setStatus(REQUEST_STATUS_OPTIONS.RESOLVED)
        } catch (error) {
          console.error(error)
          setStatus(REQUEST_STATUS_OPTIONS.REJECTED)
        }
      } else {
        setStatus(REQUEST_STATUS_OPTIONS.IDLE)
      }

      setPicture({...picture, image})
    }
  }

  function handlePopupClose() {
    setPicture(null)
    setStatus(REQUEST_STATUS_OPTIONS.IDLE)
  }

  return (
    <Marker
      icon={icon({
        iconUrl:
          'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzUyNTI1MiI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTEuNTQgMjIuMzUxbC4wNy4wNC4wMjguMDE2YS43Ni43NiAwIDAwLjcyMyAwbC4wMjgtLjAxNS4wNzEtLjA0MWExNi45NzUgMTYuOTc1IDAgMDAxLjE0NC0uNzQyIDE5LjU4IDE5LjU4IDAgMDAyLjY4My0yLjI4MmMxLjk0NC0xLjk5IDMuOTYzLTQuOTggMy45NjMtOC44MjdhOC4yNSA4LjI1IDAgMDAtMTYuNSAwYzAgMy44NDYgMi4wMiA2LjgzNyAzLjk2MyA4LjgyN2ExOS41OCAxOS41OCAwIDAwMi42ODIgMi4yODIgMTYuOTc1IDE2Ljk3NSAwIDAwMS4xNDUuNzQyek0xMiAxMy41YTMgMyAwIDEwMC02IDMgMyAwIDAwMCA2eiIgY2xpcC1ydWxlPSJldmVub2RkIiAvPjwvc3ZnPg==',
        iconSize: [30, 30],
        className: 'drop-shadow-sm'
      })}
      position={[coordinates.latitude, coordinates.longitude]}
      interactive={isInteractive}
      eventHandlers={{
        popupopen: handlePopupOpen(slug),
        popupclose: handlePopupClose
      }}
    >
      {isInteractive && (
        <Popup
          closeButton={false}
          className="ml-[.5px] [&>div:first-child>div]:!m-0 [&>div:first-child>div]:!p-2 [&>div:first-child]:!rounded-lg [&>div:first-child]:!min-h-[165px] [&>div:first-child]:bg-gradient-to-b [&>div:first-child]:!from-neutral-300 [&>div:first-child]:!via-transparent [&>div:first-child]:!text-neutral-600 [&>div>div>a]:!text-neutral-600"
          minWidth={120}
        >
          {picture && (
            <Link
              href={picture.url}
              title={picture.name}
              className="group block max-w-[120px] hover:opacity-90"
              shallow
            >
              <div className="overflow-hidden rounded">
                <Image
                  src={picture.image.src}
                  alt={picture.name}
                  aspectRatio="1:1"
                  sizes="25vw"
                  className="transition-transform group-hover:scale-105"
                  fallbackStyle={picture.image.css}
                />
              </div>

              <span className="mb-1 mt-2 inline-block text-sm font-bold leading-tight">
                {picture.name}
              </span>

              <time
                className="flex text-xs text-neutral-600/60"
                dateTime={picture.date}
              >
                {picture.prettyDate}
              </time>
            </Link>
          )}
        </Popup>
      )}
    </Marker>
  )
}

interface MapPictureProps {
  slug: string
  coordinates: Coordinates
  image: ImageInterface
  isInteractive: boolean
}
