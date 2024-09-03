import type { StoryObj, Meta } from '@storybook/react'

import { StatCard } from './stat-card'

type StatCardType = typeof StatCard
type StatCardStory = StoryObj<StatCardType>

export default {
  title: 'Components/Reports/Cards/StatCard',
  component: StatCard,
  argTypes: {
    label: {
      control: 'text',
    },
    value: {
      control: 'number',
    },
    lastWeekValue: {
      control: 'number',
    },
    valueSize: {
      control: 'select',
      options: ['md', 'lg', 'xl'],
    },
  },
} satisfies Meta<StatCardType>

export const Default: StatCardStory = {
  args: {
    label: 'Label',
    children: 100,
  },
}

export const WithValueSizeLg: StatCardStory = {
  args: {
    label: 'Label',
    children: 100,
    valueSize: 'lg',
  },
}

export const WithValueSizeXl: StatCardStory = {
  args: {
    label: 'Label',
    children: 100,
    valueSize: 'xl',
  },
}

export const WithVsLastWeekPercent: StatCardStory = {
  args: {
    label: 'Label',
    value: 100,
    children: 100,
    valueSize: 'xl',
    lastWeekValue: 50,
  },
}

export const WithValueSizeXlAndVsLastWeekPercent: StatCardStory = {
  args: {
    label: 'Label',
    value: 100,
    children: 100,
    valueSize: 'xl',
    lastWeekValue: 200,
  },
}
