import { css } from 'lit'

export default css`
  :host {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    box-shadow: -2px 1px 13px -3px rgba(0, 0, 0, 0.6);
  }
  wui-checkbox {
    width: 100%;
    padding: var(--wui-spacing-l);
    background-color: var(--wui-color-bg-150);
    border-top: 1px solid var(--wui-color-fg-350);
  }
  a {
    text-decoration: none;
    color: var(--wui-color-fg-150);
    font-weight: 500;
  }
`
