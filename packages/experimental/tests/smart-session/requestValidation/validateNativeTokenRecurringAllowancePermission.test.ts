import { beforeEach, describe, expect, it } from 'vitest'

import type { SmartSessionGrantPermissionsRequest } from '../../../exports/smart-session/index.js'
import { validateRequest } from '../../../src/smart-session/helper/index.js'
import { ERROR_MESSAGES } from '../../../src/smart-session/schema/index.js'
import type { NativeTokenRecurringAllowancePermission } from '../../../src/smart-session/utils/TypeUtils.js'
import { mockRequest } from './mockRequest.js'

describe('NativeTokenRecurringAllowancePermission validation', () => {
  let testRequest: SmartSessionGrantPermissionsRequest

  beforeEach(() => {
    testRequest = {
      ...mockRequest(),
      permissions: []
    }
  })

  const validPermission = {
    type: 'native-token-recurring-allowance',
    data: {
      allowance: '0x1234567890abcdef',
      start: Math.floor(Date.now() / 1000) + 3600, // 1 hour in the future
      period: 3600
    }
  } as NativeTokenRecurringAllowancePermission

  it('should pass for valid permissions array', () => {
    const request = {
      ...testRequest,
      permissions: [validPermission]
    }
    expect(() => validateRequest(request)).not.toThrow()
  })

  it('should pass for multiple valid permissions', () => {
    const request = {
      ...testRequest,
      permissions: [validPermission, validPermission]
    }
    expect(() => validateRequest(request)).not.toThrow()
  })

  it('should fail for empty permissions array', () => {
    const request = {
      ...testRequest,
      permissions: []
    }
    expect(() => validateRequest(request)).toThrow(ERROR_MESSAGES.INVALID_PERMISSIONS)
  })

  it('should fail for non-array permissions', () => {
    const request = {
      ...testRequest,
      permissions: validPermission as any
    }
    expect(() => validateRequest(request)).toThrow(ERROR_MESSAGES.INVALID_PERMISSIONS_TYPE)
  })

  it('should fail for invalid permission type', () => {
    const request = {
      ...testRequest,
      permissions: [{ ...validPermission, type: 'invalid-type' }] as any
    }
    expect(() => validateRequest(request)).toThrow(`Invalid permissions.0: Invalid input`)
  })

  it('should fail for missing allowance', () => {
    const request = {
      ...testRequest,
      permissions: [
        {
          type: 'native-token-recurring-allowance',
          data: {
            start: Math.floor(Date.now() / 1000) + 3600,
            period: 3600
          }
        }
      ]
    } as any
    expect(() => validateRequest(request)).toThrow('Invalid permissions.0: Invalid input')
  })

  it('should fail for invalid allowance format (missing 0x prefix)', () => {
    const request = {
      ...testRequest,
      permissions: [
        {
          type: 'native-token-recurring-allowance',
          data: {
            allowance: '1234567890abcdef',
            start: Math.floor(Date.now() / 1000) + 3600,
            period: 3600
          }
        }
      ]
    } as any
    expect(() => validateRequest(request)).toThrow(
      `Invalid permissions.0.data.allowance: ${ERROR_MESSAGES.INVALID_ALLOWANCE_FORMAT}`
    )
  })

  it('should fail for start time in the past', () => {
    //start time 1 hour in the past
    const startTime = Math.floor(Date.now() / 1000) - 3600
    console.log(startTime)
    const request = {
      ...testRequest,
      permissions: [
        {
          type: 'native-token-recurring-allowance',
          data: {
            allowance: '0x1234567890abcdef',
            start: startTime,
            period: 3600
          }
        }
      ] as NativeTokenRecurringAllowancePermission[]
    }
    expect(() => validateRequest(request)).toThrow(
      `Invalid permissions.0.data.start: ${ERROR_MESSAGES.INVALID_START}`
    )
  })

  it('should fail for missing period', () => {
    const request = {
      ...testRequest,
      permissions: [
        {
          type: 'native-token-recurring-allowance',
          data: {
            allowance: '0x1234567890abcdef',
            start: Math.floor(Date.now() / 1000) + 3600
          }
        }
      ]
    } as any
    expect(() => validateRequest(request)).toThrow('Invalid permissions.0: Invalid input')
  })

  it('should fail for missing period', () => {
    const request = {
      ...testRequest,
      permissions: [
        {
          type: 'native-token-recurring-allowance',
          data: {
            allowance: '0x1234567890abcdef',
            start: Math.floor(Date.now() / 1000) + 3600,
            period: -3600
          }
        }
      ]
    } as any
    expect(() => validateRequest(request)).toThrow(
      `Invalid permissions.0.data.period: ${ERROR_MESSAGES.INVALID_PERIOD}`
    )
  })
})
