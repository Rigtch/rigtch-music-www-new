import Image from 'next/image'
import Link from 'next/link'

import { AlbumPageProps } from '@app/(items)/types'
import { getAlbum } from '@app/api/fetchers/get-album'
import { ALBUM_ID } from '@app/constants'
import { validateId } from '@app/utils/validate-id'
import { OpenInSpotifyButton } from '@app/components/common'
import { ButtonLink } from '@app/components/button-link'
import { getImage } from '@app/utils/get-image'

export default async function AlbumPage({ params }: AlbumPageProps) {
  const albumId = validateId(params[ALBUM_ID])

  const { name, images, artists, href, releaseDate, tracks } = await getAlbum({
    id: albumId,
  })

  const dateOfRelease = new Date(releaseDate).toLocaleString('default', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const numberOfDiscs = Math.max(...tracks.map(track => track.discNumber))

  const discTracks = []

  for (let index = 1; index <= numberOfDiscs; index++) {
    discTracks.push(
      tracks
        .filter(track => track.discNumber === index)
        .sort(
          (firstTrack, secondTrack) =>
            firstTrack.trackNumber - secondTrack.trackNumber
        )
    )
  }

  return (
    <div className="w-full flex flex-col p-12 gap-2">
      <div className="w-full flex md:flex-row flex-col p-12 gap-8">
        <Image
          src={getImage(images, 200)}
          className="rounded-xl md:rounded-md w-full md:h-[200px] md:w-[200px]"
          width="350"
          height="350"
          alt={name}
        />

        <div className="flex flex-col gap-6 justify-center">
          <div className="flex flex-col gap-2">
            <span className="text-2xl md:text-5xl">{name}</span>

            <div className="flex flex-row items-center gap-2 mr-4">
              <OpenInSpotifyButton href={href} />

              <span className="text-xl">
                by
                {artists.map((artist, index) => (
                  <ButtonLink key={index} href={`/artist/${artist.id}`}>
                    {artist.name}
                  </ButtonLink>
                ))}
              </span>
            </div>

            <div>Release date: {dateOfRelease}</div>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-6">
        <div className="text-4xl">Tracks</div>

        {discTracks.map((disc, index) => (
          <div key={index} className="flex flex-col gap-4">
            {numberOfDiscs > 1 && (
              <span className="text-2xl">Disc {index + 1}</span>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 p-4">
              {disc.map((track, index) => (
                <div
                  key={index}
                  className="flex flex-row w-full items-center justify-between gap-4 p-2 px-4 bg-neutral-800 rounded-xl"
                >
                  <div className="flex flex-row items-center gap-3 pt-0">
                    <span className="text-xl w-[25px] text-center">
                      {track.trackNumber}
                    </span>

                    <div className="flex flex-col justify-center">
                      <Link
                        href={`/track/${track.id}`}
                        className="hover:underline truncate w-[30vw] md:w-[50vw] lg:w-[28vw] xl:w-[13vw]"
                      >
                        {track.name}
                      </Link>

                      <span className="text-sm font-semibold text-gray-400">
                        {track.artists.map((artist, index) => (
                          <Link
                            href={`/artist/${artist.id}`}
                            key={index}
                            className="hover:underline"
                          >
                            {artist.name}
                            {index + 1 < track.artists.length && ', '}
                          </Link>
                        ))}
                      </span>
                    </div>
                  </div>

                  <OpenInSpotifyButton href={track.href} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
