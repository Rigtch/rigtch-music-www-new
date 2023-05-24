import Image from 'next/image'

import { ProfileInfo } from './profile-info'
import { ConnectButton } from './buttons'

import { rigtchLogo } from '~/assets/images'
import { useAuth } from '~/hooks/auth'

export function NavigationBar() {
  const { isAuthorized } = useAuth()

  return (
    <header className="flex px-4 py-2 surface-card border-round-sm justify-content-between">
      <div className="flex align-items-center gap-4">
        <Image
          src={rigtchLogo}
          alt="Rigtch"
          width={32}
          className="border-round-sm"
        />

        <p className="font-semibold uppercase">Rigtch</p>
      </div>

      <div className="flex align-items-center gap-2">
        {isAuthorized ? <ProfileInfo /> : <ConnectButton />}
      </div>
    </header>
  )
}
