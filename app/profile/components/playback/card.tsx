'use client'

import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { PlaybackCardSkeleton } from './card.skeleton'
import { PlaybackToggleStateButton } from './toggle-state-button'
import { AudioBars } from './audio-bars'

import { SpotifyLink, RelativeTime } from '@app/components/common'
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@app/components/ui/card'
import { Skeleton } from '@app/components/ui/skeleton'
import { USER_ID } from '@app/constants'
import { useAuthCookies } from '@app/hooks/use-auth-cookies'
import { usePlaybackStateContext } from '@app/profile/context/playback-state'
import { formatArtists } from '@app/profile/utils/formatters'
import { cn } from '@app/utils/cn'
import { getImage } from '@app/utils/get-image'

export function PlaybackCard() {
  const { data, isPlaying, toggleState } = usePlaybackStateContext()
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [isPlayingState, setIsPlayingState] = useState(isPlaying)
  const { userId } = useAuthCookies()
  const params = useParams()

  const routeUserId = params[USER_ID].toString()

  useEffect(() => {
    setIsPlayingState(isPlaying)
  }, [isPlaying])

  if (!data?.track) return <PlaybackCardSkeleton />

  const {
    device,
    track: { album, ...track },
  } = data

  async function handleToggleState() {
    setIsPlayingState(isPlaying => !isPlaying)

    await toggleState(isPlaying)
  }

  return (
    <Card
      className={cn(
        'p-4 w-full h-full !m-0 lg:w-[380px] xl:min-w-[380px] xl:w-2/5',
        isPlayingState ? 'bg-success border-success' : 'bg-neutral-800/50 '
      )}
    >
      <CardHeader className="flex flex-col sm:flex-row gap-4 p-0 w-full space-y-0">
        <Image
          src={getImage(album, 96)}
          width={96}
          height={96}
          alt={album.name}
          className={cn(
            'rounded-md w-full sm:w-auto',
            isImageLoaded ? 'opacity-100' : 'opacity-0'
          )}
          style={{ height: '128px', width: '128px' }}
          onLoad={() => {
            setIsImageLoaded(true)
          }}
        />

        {!isImageLoaded && <Skeleton className="h-[128px] w-[128px]" />}

        <div className="flex flex-col justify-between w-full md:max-w-[calc(100%-140px)] gap-4 md:gap-0">
          <CardTitle className="whitespace-nowrap font-normal flex flex-col gap-1">
            <p className="text-2xl inline-block text-ellipsis overflow-hidden whitespace-nowrap">
              {track.name}
            </p>

            <p className="text-neutral-300 truncate max-w-[380px]">
              {formatArtists(track.artists)}
            </p>
          </CardTitle>

          <CardFooter className="flex justify-between items-center w-full">
            <div className="flex gap-2 items-center">
              <AudioBars isPlaying={isPlaying} />

              <PlaybackToggleStateButton
                isPlaying={isPlayingState}
                isDeviceAvailable={!!device}
                hasAccess={routeUserId === userId}
                toggleState={handleToggleState}
              />
            </div>

            <div className="flex flex-row gap-2 min-w-max">
              {!device && track.playedAt && (
                <RelativeTime value={track.playedAt} />
              )}

              <SpotifyLink href={track.href} />
            </div>
          </CardFooter>
        </div>
      </CardHeader>
    </Card>
  )
}
