'use client'

import Image from 'next/image'

import { PlaybackStateToggleButton } from './state-toggle-button'

import { Card, CardFooter, CardHeader, CardTitle } from '@components/ui/card'
import { usePlaybackStateContext } from '@context/playback-state'
import { formatArtists } from '@utils/formatters'
import { AudioBars, OpenInSpotifyButton } from '@components/common'

export function PlaybackCard() {
  const { data, isPlaying, toggleState } = usePlaybackStateContext()

  if (!data) return null

  const {
    device,
    track: { album, ...track },
  } = data

  return (
    <Card className="bg-success border-success p-4 w-full h-full items-center">
      <CardHeader className="flex flex-row gap-4 p-0 w-full space-y-0">
        <Image
          src={album.images[0].url}
          width={96}
          height={96}
          alt={album.name}
          className="rounded-md"
        />

        <div className="flex flex-col justify-between w-full">
          <CardTitle className="whitespace-nowrap w-full font-normal flex flex-col gap-1">
            <p className="text-2xl">{track.name}</p>
            <p className="text-neutral-300">{formatArtists(track.artists)}</p>
          </CardTitle>

          <CardFooter className="flex justify-between items-center">
            <div className="flex gap-2">
              <AudioBars isPlaying={isPlaying} />

              <PlaybackStateToggleButton
                isPlaying={isPlaying}
                isDeviceAvailable={!!device}
                toggleState={toggleState}
              />
            </div>

            <OpenInSpotifyButton href={track.href} />
          </CardFooter>
        </div>
      </CardHeader>
    </Card>
  )
}
