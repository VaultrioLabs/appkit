import { ModalController, SnackController } from '@web3modal/core'
import { initializeTheming, setColorTheme } from '@web3modal/ui'
import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { animate } from 'motion'
import styles from './styles'

@customElement('w3m-modal')
export class W3mModal extends LitElement {
  public static styles = styles

  // -- Members ------------------------------------------- //
  private unsubscribe: (() => void)[] = []

  // -- State & Properties -------------------------------- //
  @state() private open = ModalController.state.open

  public constructor() {
    super()
    initializeTheming()
    setColorTheme('dark')
    this.unsubscribe.push(
      ModalController.subscribeKey('open', val => (val ? this.onOpen() : this.onClose()))
    )
  }

  public disconnectedCallback() {
    this.unsubscribe.forEach(unsubscribe => unsubscribe())
  }

  // -- Render -------------------------------------------- //
  public render() {
    return this.open
      ? html`
          <wui-overlay @click=${this.onOverlayClick.bind(this)}>
            <wui-card>
              <w3m-header></w3m-header>
              <w3m-router></w3m-router>
              <w3m-snackbar></w3m-snackbar>
            </wui-card>
          </wui-overlay>
        `
      : null
  }

  // -- Private ------------------------------------------- //
  private onOverlayClick(event: PointerEvent) {
    if (event.target === event.currentTarget) {
      ModalController.close()
    }
  }

  private async onClose() {
    await animate(this, { opacity: [1, 0] }, { duration: 0.2 }).finished
    SnackController.hide()
    this.open = false
  }

  private onOpen() {
    this.open = true
    animate(this, { opacity: [0, 1] }, { duration: 0.2 })
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'w3m-modal': W3mModal
  }
}