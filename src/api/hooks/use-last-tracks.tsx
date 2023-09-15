import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import { LAST_TRACKS } from '@api/constants'
import { getLastTracks } from '@api/fetchers'
import { useAuthCookies } from '@hooks/use-auth-cookies'

export const useLastTracksQuery = () => {
  const { accessToken } = useAuthCookies()

  return useQuery([LAST_TRACKS], () => getLastTracks(accessToken))
}

export const useLastTracksInfiniteQuery = (limit = 20) => {
  const { accessToken } = useAuthCookies()

  return useInfiniteQuery(
    [LAST_TRACKS],
    ({ pageParam }) => getLastTracks(accessToken, limit, pageParam),
    {
      getNextPageParam: lastPage =>
        lastPage.next ? lastPage.cursors.before : undefined,
    }
  )
}
