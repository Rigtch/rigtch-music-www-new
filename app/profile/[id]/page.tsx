import { Suspense } from 'react'

import { StatsOptions } from '../components/common'
import {
  BETA_USER_CREATED_AT,
  STATS_MEASUREMENT,
  STATS_PROVIDER,
  TIME_RANGE,
  VIEW,
} from '../constants'
import { StatsProvider } from '../enums'
import {
  AnalysisSectionSkeleton,
  ItemsSectionSkeleton,
  TopGenresSectionSkeleton,
} from '../sections'
import type { ProfilePageProps } from '../types'
import {
  validateStatsMeasurement,
  validateStatsProvider,
  validateTimeRange,
  validateView,
} from '../utils/validators'

import {
  AnalysisView,
  HistoryView,
  TopAlbumsView,
  TopArtistsView,
  TopGenresView,
  TopTracksView,
  TotalReportView,
} from './views'
import type { ProfileOverviewViewProps } from './views/types/props'
import { TotalReportViewSkeleton } from './views/total-report-view.skeleton'

import { getUser } from '@app/api/fetchers'
import { getServerToken } from '@app/auth'
import { validateId } from '@app/utils/validators'
import { ErrorBoundary } from '@app/error-boundary'

export default async function ProfilePage({
  params,
  searchParams,
}: ProfilePageProps) {
  const userId = validateId(params.id)
  const token = await getServerToken(userId)

  const { createdAt } = await getUser(token, {
    userId,
  })

  const statsProvider = validateStatsProvider(
    searchParams[STATS_PROVIDER],
    createdAt
  )
  const measurement = validateStatsMeasurement(searchParams[STATS_MEASUREMENT])
  const timeRange = validateTimeRange(
    searchParams[TIME_RANGE],
    statsProvider,
    createdAt
  )
  const view = validateView(searchParams[VIEW])

  const userCreatedAt = createdAt ?? BETA_USER_CREATED_AT

  const viewProps: ProfileOverviewViewProps = {
    token,
    userId,
    measurement,
    statsProvider,
    timeRange,
    view,
  }

  return (
    <>
      <Suspense fallback={<TotalReportViewSkeleton />}>
        <TotalReportView token={token} userId={userId} createdAt={createdAt} />
      </Suspense>

      <div className="xl:my-4">
        <StatsOptions {...viewProps} userCreatedAt={userCreatedAt} />
      </div>

      <Suspense fallback={<TopGenresSectionSkeleton length={20} />}>
        <TopGenresView {...viewProps} />
      </Suspense>

      <Suspense
        fallback={
          <ItemsSectionSkeleton
            title={'Top Artists'}
            view={view}
            withGenres
            withProgress={statsProvider === StatsProvider.RIGTCH}
          />
        }
      >
        <TopArtistsView {...viewProps} />
      </Suspense>

      <Suspense
        fallback={
          <ItemsSectionSkeleton
            title={'Top Albums'}
            view={view}
            withArtists
            withProgress
          />
        }
      >
        <TopAlbumsView {...viewProps} />
      </Suspense>

      <Suspense
        fallback={
          <ItemsSectionSkeleton
            title={'Top Tracks'}
            view={view}
            withProgress={statsProvider === StatsProvider.RIGTCH}
          />
        }
      >
        <TopTracksView {...viewProps} />
      </Suspense>

      <Suspense fallback={<AnalysisSectionSkeleton />}>
        <AnalysisView {...viewProps} />
      </Suspense>

      <ErrorBoundary>
        <Suspense
          fallback={<ItemsSectionSkeleton title={'History'} withPlayedAt />}
        >
          <HistoryView {...viewProps} />
        </Suspense>
      </ErrorBoundary>
    </>
  )
}
