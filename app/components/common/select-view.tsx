'use client'

import { LuLayers, LuList } from 'react-icons/lu'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from '../ui/select'

import { View } from '@app/types'
import { formatSearchParams } from '@app/profile/utils/formatters'
import { createSettingsCookie } from '@app/utils/settings-cookies'
import { useRouteName } from '@app/hooks/use-route-name'

export interface SelectViewProps {
  initialValue: View
}

export function SelectView({ initialValue }: SelectViewProps) {
  const viewOptions = [
    {
      icon: <LuLayers />,
      value: View.CARD,
      label: 'Card',
    },
    {
      icon: <LuList />,
      value: View.LIST,
      label: 'List',
    },
  ]

  const pathname = usePathname()
  const routeName = useRouteName()
  const searchParams = useSearchParams()
  const router = useRouter()

  async function handleOnValueChange(value: View) {
    router.push(
      `${pathname}?${formatSearchParams(searchParams, 'view', value)}`,
      {
        scroll: true,
      }
    )

    await createSettingsCookie(routeName, value, 'view')

    console.log('done')
  }

  return (
    <Select defaultValue={initialValue} onValueChange={handleOnValueChange}>
      <SelectTrigger className="min-w-[120px]">
        <SelectValue placeholder="Select view" />
      </SelectTrigger>

      <SelectContent>
        {viewOptions.map(({ icon, value, label }) => (
          <SelectItem key={value} value={value} className="flex gap-2">
            <div className="flex gap-2 items-center">
              {icon}
              {label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
