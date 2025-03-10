import { describe, expect, it } from 'vitest'
import { nextTick, shallowRef } from 'vue'
import { useConfirmDialog } from './index'

describe('useConfirmDialog', () => {
  it('should be defined', () => {
    expect(useConfirmDialog).toBeDefined()
  })

  it('should open the dialog and close on confirm', () => {
    const show = shallowRef(false)

    const {
      reveal,
      confirm,
    } = useConfirmDialog(show)

    reveal()
    expect(show.value).toBe(true)

    confirm()
    expect(show.value).toBe(false)
  })

  it('should close on cancel', () => {
    const show = shallowRef(false)

    const {
      reveal,
      cancel,
    } = useConfirmDialog(show)

    reveal()
    expect(show.value).toBe(true)

    cancel()
    expect(show.value).toBe(false)
  })

  it('should execute `onReveal` fn on open dialog', () => {
    const show = shallowRef(false)
    const message = shallowRef('initial')

    const {
      reveal,
      cancel,
      onReveal,
    } = useConfirmDialog(show)
    expect(message.value).toBe('initial')
    onReveal(() => {
      message.value = 'final'
    })
    reveal()
    expect(message.value).toBe('final')

    cancel()
    expect(show.value).toBe(false)
  })

  it('should execute a callback inside `onConfirm` hook only after confirming', () => {
    const show = shallowRef(false)
    const message = shallowRef('initial')

    const {
      reveal,
      confirm,
      onConfirm,
    } = useConfirmDialog(show)

    onConfirm(() => {
      message.value = 'final'
    })
    expect(message.value).toBe('initial')

    reveal()
    expect(message.value).toBe('initial')
    confirm()
    expect(message.value).toBe('final')
  })

  it('should execute a callback inside `onCancel` hook only after canceling dialog', () => {
    const show = shallowRef(false)
    const message = shallowRef('initial')

    const {
      reveal,
      cancel,
      onCancel,
    } = useConfirmDialog(show)

    onCancel(() => {
      message.value = 'final'
    })
    expect(message.value).toBe('initial')

    reveal()
    expect(message.value).toBe('initial')
    cancel()
    expect(message.value).toBe('final')
  })

  it('should pass data from confirm fn to `onConfirm` hook', () => {
    const message = shallowRef('initial')
    const show = shallowRef(false)
    const data = { value: 'confirm' }

    const {
      reveal,
      confirm,
      onConfirm,
    } = useConfirmDialog(show)

    onConfirm((data) => {
      message.value = data.value
    })

    reveal()
    confirm(data)

    expect(message.value).toBe('confirm')
  })

  it('should pass data from cancel fn to `onCancel` hook', async () => {
    const message = shallowRef('initial')
    const show = shallowRef(false)
    const data = { value: 'confirm' }

    const {
      reveal,
      cancel,
      onCancel,
    } = useConfirmDialog(show)

    onCancel((data) => {
      message.value = data.value
    })

    reveal()
    cancel(data)

    expect(message.value).toBe('confirm')
  })

  it('should return promise that will be resolved on `confirm()`', async () => {
    const show = shallowRef(false)

    const {
      reveal,
      confirm,
    } = useConfirmDialog(show)

    setTimeout(() => {
      confirm(true)
    }, 1)

    const { data, isCanceled } = await reveal()

    await nextTick()

    expect(data).toBe(true)
    expect(isCanceled).toBe(false)
  })

  it('should return promise that will be resolved on `cancel()`', async () => {
    const show = shallowRef(false)

    const {
      reveal,
      cancel,
    } = useConfirmDialog(show)

    setTimeout(() => {
      cancel(true)
    }, 1)

    const { data, isCanceled } = await reveal()

    await nextTick()

    expect(data).toBe(true)
    expect(isCanceled).toBe(true)
  })
})
