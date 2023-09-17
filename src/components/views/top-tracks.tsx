import { HTMLAttributes, ReactNode } from 'react'

import { TimeRange, Track } from '@api/types'
import {
  TopOneElementCard,
  ElementCard,
  ElementCardSize,
} from '@components/element'
import { SelectTimeRange } from '@components/select-time-range'
import { TopOneElementCardSkeleton } from '@components/element/top-one-card-skeleton'
import { ElementCardSkeleton } from '@components/element/card-skeleton'

export interface TopTracksViewProps extends HTMLAttributes<HTMLDivElement> {
  timeRange: TimeRange
  setTimeRange: (timeRange: TimeRange) => void
  items: Track[]
  moreItems?: ReactNode
  skeleton?: boolean
}

export function TopTracksView({
  timeRange,
  setTimeRange,
  items,
  moreItems,
  children,
  skeleton,
}: TopTracksViewProps) {
  return (
    <section className="flex-column flex w-full gap-4 md:gap-2">
      <header className="flex flex-column md:flex-row gap-2 align-items-center justify-content-between">
        <h2 className="text-5xl">Top Tracks</h2>

        <SelectTimeRange value={timeRange} onChange={setTimeRange} />
      </header>

      <main className="flex-column flex w-full gap-4 md:gap-8">
        <div className="flex flex-column w-full flex-row flex-wrap gap-6">
          <div className="justify-content-center xl:justify-content-between flex w-full flex-column md:flex-row xl:flex-nowrap gap-6">
            {skeleton ? (
              <TopOneElementCardSkeleton album={true} />
            ) : (
              <TopOneElementCard
                {...items[0]}
                image={items[0]?.album.images[0].url}
              />
            )}

            <div className="flex-column flex gap-2 lg:gap-3 sm:w-7 w-full">
              {skeleton
                ? Array.from({ length: 4 }).map((item, index) => (
                    <ElementCardSkeleton
                      key={index}
                      size={ElementCardSize.LARGE}
                      position={index + 2}
                      artists
                    />
                  ))
                : items
                    .slice(1, 5)
                    .map(({ album, ...track }, index) => (
                      <ElementCard
                        {...track}
                        album={album}
                        image={album.images[0].url}
                        size={ElementCardSize.LARGE}
                        key={index}
                        position={index + 2}
                      />
                    ))}
            </div>
          </div>

          <div className="flex-column flex w-full gap-2 lg:gap-3">
            {skeleton
              ? Array.from({ length: 5 }).map((item, index) => (
                  <ElementCardSkeleton
                    key={index}
                    size={ElementCardSize.MEDIUM}
                    position={index + 6}
                    artists
                  />
                ))
              : items
                  .slice(5)
                  .map(({ album, ...artist }, index) => (
                    <ElementCard
                      key={index}
                      {...artist}
                      image={album.images[0].url}
                      size={ElementCardSize.MEDIUM}
                      position={index + 6}
                    />
                  ))}

            {moreItems}
          </div>
        </div>

        {children}
      </main>
    </section>
  )
}
