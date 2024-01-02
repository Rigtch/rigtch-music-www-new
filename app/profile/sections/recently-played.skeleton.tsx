import { ItemsListSkeleton } from '@app/profile/components/items'
import { DefaultSection } from '@app/sections'

export default function RecentlyPlayedSkeleton() {
  return (
    <DefaultSection title={'Recently Played'}>
      <ItemsListSkeleton playedAt withoutPosition />
    </DefaultSection>
  )
}
