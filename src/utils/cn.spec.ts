import { cn } from './cn'

vi.mock('clsx', () => ({
  clsx: (value: string) => 'clsx' + value,
}))
vi.mock('tailwind-merge', () => ({
  twMerge: (value: string) => 'twMerge' + value,
}))

describe('(Utils) - cn', () => {
  describe('cn', () => {
    test('should return twMerge(clsx(...inputs))', () => {
      expect(cn('test')).toEqual('twMergeclsxtest')
    })
  })
})
