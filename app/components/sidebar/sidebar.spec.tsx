import { render } from '@testing-library/react'
import { useParams, useSearchParams } from 'next/navigation'
import type { Mock } from 'vitest'

import { Sidebar } from './sidebar'

vi.mock('next/navigation')
vi.mock('@app/api/hooks', () => ({
  useUserQuery: vi.fn().mockReturnValue({
    data: { createdAt: new Date() },
  }),
}))

describe('Sidebar', () => {
  beforeEach(() => {
    vi.mocked(useParams).mockReturnValue({ id: '1' })
    ;(vi.mocked(useSearchParams) as Mock).mockReturnValue({
      toString: vi.fn(),
      get: vi.fn().mockReturnValue('list'),
    })
  })

  test('should match snapshot', () => {
    const view = render(<Sidebar />)

    expect(view).toMatchSnapshot()
  })
})
