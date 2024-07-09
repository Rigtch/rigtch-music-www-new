import { redirect } from 'next/navigation'

import { getRigtchTopAlbums } from '@app/api/fetchers/stats/rigtch'
import type { RigtchTimeRange } from '@app/api/types'
import { getServerToken } from '@app/auth'
import { STATS_MEASUREMENT, TIME_RANGE, VIEW } from '@app/profile/constants'
import { ItemsSection } from '@app/profile/sections'
import { StatsProvider, type ProfilePageProps } from '@app/profile/types'
import { validateId } from '@app/utils/validate-id'
import {
  validateStatsMeasurement,
  validateTimeRange,
  validateView,
} from '@app/profile/utils/validators'
import { afterParamFactory } from '@app/profile/utils/factories'

export const runtime = 'edge'

export default async function ProfileTopAlbumsPage({
  searchParams,
  params,
}: ProfilePageProps) {
  const userId = validateId(params.id)
  const statsMeasurement = validateStatsMeasurement(
    searchParams[STATS_MEASUREMENT]
  )
  const timeRange = validateTimeRange(
    searchParams[TIME_RANGE],
    StatsProvider.RIGTCH
  )
  const view = validateView(searchParams[VIEW])

  const token = await getServerToken()

  if (!token) redirect('/')

  const items = await getRigtchTopAlbums(token, {
    after: afterParamFactory(timeRange as RigtchTimeRange),
    userId,
    limit: 100,
    measurement: statsMeasurement,
  })

  return <ItemsSection items={items} title="Top Albums" view={view} />
}
