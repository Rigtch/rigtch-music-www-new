import { Avatar } from 'primereact/avatar'
import { Card } from 'primereact/card'

import { PlaybackCard } from '../playback/card'
import { OpenInSpotifyButton } from '../common'

import { useProfileQuery } from '@api/hooks'
import { getImage } from '@utils/get-image'

export function ProfileCard() {
  const { data } = useProfileQuery()

  if (!data) return null

  const { displayName, followers, href, images } = data

  const image = getImage(images, 1)

  return (
    <Card>
      <div className="flex-column justify-content-between flex gap-4 lg:flex-row">
        <header className="flex gap-4 p-2">
          <Avatar
            image={image}
            shape="circle"
            label={displayName.slice(0, 1)}
            size="xlarge"
            style={{ width: '96px', height: '96px' }}
            className="border-circle"
          />

          <div className="flex-column justify-content-between flex">
            <div>
              <h2 className="m-0 text-4xl">{displayName}</h2>

              <p className="text-300 m-0 text-sm">{followers} Followers</p>
            </div>

            <div>
              <OpenInSpotifyButton href={href} />
            </div>
          </div>
        </header>

        <main>
          <PlaybackCard />
        </main>
      </div>
    </Card>
  )
}
