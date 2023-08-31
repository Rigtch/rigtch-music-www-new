import { Fragment, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { QueryClient, dehydrate } from '@tanstack/react-query'
import { GetServerSideProps } from 'next'

import { TimeRange } from '@api/types'
import { ElementCard, ElementCardSize } from '@components/element'
import { TopTracksView } from '@components/views'
import { useTopTracksInfiniteQuery } from '@hooks/api'
import { InfiniteLoadingButton } from '@components/common'
import {
  ACCESS_TOKEN,
  PROFILE,
  TOP_TRACKS,
  USER_NOT_REGISTERED,
} from '@api/constants'
import { getProfile, getTopTracks } from '@api/fetchers'
import { PageProps } from '@pages/_app'

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  req: { cookies },
}) => {
  try {
    const accessToken = cookies[ACCESS_TOKEN]
    const queryClient = new QueryClient()

    await queryClient.fetchQuery([PROFILE], () => getProfile(accessToken))
    await queryClient.prefetchQuery([TOP_TRACKS], () =>
      getTopTracks(accessToken)
    )

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    }
  } catch (error) {
    if (error instanceof Error && error.message === USER_NOT_REGISTERED)
      return {
        redirect: {
          destination: '/not-registered',
          permanent: false,
        },
      }

    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
}

export default function ProfileTopTracks() {
  const LIMIT = 20

  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.LONG_TERM)
  const { data, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useTopTracksInfiniteQuery(timeRange, LIMIT)
  const { ref, inView } = useInView()

  useEffect(() => {
    refetch()
  }, [timeRange, refetch])

  useEffect(() => {
    if (inView) fetchNextPage()
  }, [inView, fetchNextPage])

  if (!data?.pages[0].items) return null

  return (
    <TopTracksView
      timeRange={timeRange}
      setTimeRange={setTimeRange}
      items={data.pages[0].items}
      moreItems={data.pages.slice(1).map(page => (
        <Fragment key={page.offset}>
          {page.items.map(({ album, ...track }, index) => (
            <ElementCard
              key={track.id}
              {...track}
              image={album.images[0].url}
              size={ElementCardSize.MEDIUM}
              position={index + page.offset + 1}
            />
          ))}
        </Fragment>
      ))}
    >
      <div className="flex justify-content-center">
        <InfiniteLoadingButton
          refFunction={ref}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </TopTracksView>
  )
}
