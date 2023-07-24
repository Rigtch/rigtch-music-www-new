import { describe, test, vi } from 'vitest'

import { getLastTracks } from './get-last-tracks'

import { trackMock } from '@tests/mocks'

describe('getLastTracks', () => {
  test('should return response', async () => {
    vi.stubGlobal('fetch', () => ({
      status: 200,
      json: () => [trackMock],
    }))

    const [{ name }] = await getLastTracks()

    expect(name).toEqual('Track 1')
  })

  test('should throw error when status is 401', () => {
    vi.stubGlobal('fetch', () => ({
      status: 401,
      statusText: 'Unauthorized',
    }))

    expect(getLastTracks()).rejects.toThrow('Unauthorized')
  })
})
