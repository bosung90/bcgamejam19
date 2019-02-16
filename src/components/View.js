import React from 'react'
import { css } from 'emotion'

const MATCHES = {
  maxXS: window.matchMedia('(max-width: 375px)'),
  maxSM: window.matchMedia('(max-width: 576px)'),
  maxMD: window.matchMedia('(max-width: 767px)'),
  maxLG: window.matchMedia('(max-width: 992px)'),
  maxXL: window.matchMedia('(max-width: 1200px)'),
}

export default class View extends React.Component {
  state = {}
  componentDidMount() {
    const {
      maxXSStyle,
      maxSMStyle,
      maxMDStyle,
      maxLGStyle,
      maxXLStyle,
    } = this.props
    if (maxXSStyle) {
      this._onMatchXS(MATCHES.maxXS)
      MATCHES.maxXS.addListener(this._onMatchXS)
    }
    if (maxSMStyle) {
      this._onMatchSM(MATCHES.maxSM)
      MATCHES.maxSM.addListener(this._onMatchSM)
    }
    if (maxMDStyle) {
      this._onMatchMD(MATCHES.maxMD)
      MATCHES.maxMD.addListener(this._onMatchMD)
    }
    if (maxLGStyle) {
      this._onMatchLG(MATCHES.maxLG)
      MATCHES.maxLG.addListener(this._onMatchLG)
    }
    if (maxXLStyle) {
      this._onMatchXL(MATCHES.maxXL)
      MATCHES.maxXL.addListener(this._onMatchXL)
    }
  }
  componentWillUnmount() {
    MATCHES.maxXS.removeListener(this._onMatchXS)
    MATCHES.maxSM.removeListener(this._onMatchSM)
    MATCHES.maxMD.removeListener(this._onMatchMD)
    MATCHES.maxLG.removeListener(this._onMatchLG)
    MATCHES.maxXL.removeListener(this._onMatchXL)
  }
  render() {
    const {
      children,
      onClick,
      style: customStyle,
      className: customClassName,
      ...props
    } = this.props
    // 1. Apply base style
    const style = [styles.baseStyle]
    // 2. Apply prop styles
    const keys = Object.keys(props)
    for (const key of keys) {
      if (props[key] === true && styles[key]) {
        style.push(styles[key])
      }
      // Check if key is any of the following
      // ph - padding horizontal
      // pv - padding vertical
      // pl - padding left
      // pr - padding right
      // pt - padding top
      // pb - padding bottom
      // p - padding
      // same for margin but starts with m instead of p
      // w - width
      // h - height
      // bg - backgroundColor
      // br - borderRadius
      // if so then the value is the corresponding style value
      // ex. ph={20} -> style={{paddingHorizontal: 20}}
      // ex. w='100%' -> style={{width: '100%'}}

      switch (key) {
        case 'mh':
          style.push(css({ marginLeft: props[key], marginRight: props[key] }))
          break
        case 'mv':
          style.push(css({ marginTop: props[key], marginBottom: props[key] }))
          break
        case 'mt':
          style.push(css({ marginTop: props[key] }))
          break
        case 'mb':
          style.push(css({ marginBottom: props[key] }))
          break
        case 'ml':
          style.push(css({ marginLeft: props[key] }))
          break
        case 'mr':
          style.push(css({ marginRight: props[key] }))
          break
        case 'm':
          style.push(css({ margin: props[key] }))
          break
        case 'ph':
          style.push(css({ paddingLeft: props[key], paddingRight: props[key] }))
          break
        case 'pv':
          style.push(css({ paddingTop: props[key], paddingBottom: props[key] }))
          break
        case 'pt':
          style.push(css({ paddingTop: props[key] }))
          break
        case 'pb':
          style.push(css({ paddingBottom: props[key] }))
          break
        case 'pl':
          style.push(css({ paddingLeft: props[key] }))
          break
        case 'pr':
          style.push(css({ paddingRight: props[key] }))
          break
        case 'p':
          style.push(css({ padding: props[key] }))
          break
        case 'w':
          style.push(css({ width: props[key] }))
          break
        case 'minW':
          style.push(css({ minWidth: props[key] }))
          break
        case 'h':
          style.push(css({ height: props[key] }))
          break
        case 'minH':
          style.push(css({ minHeight: props[key] }))
          break
        case 'bg':
          style.push(css({ backgroundColor: props[key] }))
          break
        case 'br':
          style.push(css({ borderRadius: props[key] }))
          break
        case 'bc':
          style.push(css({ border: 'solid', borderColor: props[key] }))
          break
        case 'bw':
          style.push(css({ borderWidth: props[key] }))
          break
        case 'bbw':
          style.push(css({ borderBottomWidth: props[key] }))
          break
        case 'btw':
          style.push(css({ borderTopWidth: props[key] }))
          break
        case 'blw':
          style.push(css({ borderLeftWidth: props[key] }))
          break
        case 'brw':
          style.push(css({ borderRightWidth: props[key] }))
          break
        case 'top':
          style.push(css({ top: props[key] }))
          break
        case 'bottom':
          style.push(css({ bottom: props[key] }))
          break
        case 'left':
          style.push(css({ left: props[key] }))
          break
        case 'right':
          style.push(css({ right: props[key] }))
          break
        case 'color':
          style.push(css({ color: props[key] }))
          break
        case 'fontSize':
          style.push(css({ fontSize: props[key] }))
          break
        case 'whiteSpace':
          style.push(css({ whiteSpace: props[key] }))
          break
        case 'fill':
          if (props[key] !== true) {
            style.push(css({ flex: props[key] }))
          }
          break
        default:
          break
      }
    }
    // 3. Apply customStyle passed down as this.props.style
    style.push(customStyle)
    style.push(customClassName)
    return (
      <div className={css(style)} onClick={onClick}>
        {children}
      </div>
    )
  }
  _onMatchXS = ({ matches }) => {
    this.setState({ matchXS: matches })
  }
  _onMatchSM = ({ matches }) => {
    this.setState({ matchSM: matches })
  }
  _onMatchMD = ({ matches }) => {
    this.setState({ matchMD: matches })
  }
  _onMatchLG = ({ matches }) => {
    this.setState({ matchLG: matches })
  }
  _onMatchXL = ({ matches }) => {
    this.setState({ matchXL: matches })
  }
}

const styles = {
  baseStyle: css({
    display: 'flex',
    flexDirection: 'column',
  }),
  flex: css({
    display: 'flex',
  }),
  block: css({
    display: 'block',
  }),
  inlineBlock: css({
    display: 'inline-block',
  }),
  fill: css({
    flex: 1,
  }),
  wrap: css({
    flexWrap: 'wrap',
  }),
  row: css({
    flexDirection: 'row',
  }),
  column: css({
    flexDirection: 'column',
  }),
  absolute: css({
    position: 'absolute',
  }),
  absoluteFill: css({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  }),
  relative: css({
    position: 'relative',
  }),
  textCenter: css({
    textAlign: 'center',
  }),
  center: css({
    alignItems: 'center',
    justifyContent: 'center',
  }),
  selfStart: css({
    alignSelf: 'start',
  }),
  selfStretch: css({
    alignSelf: 'stretch',
  }),
  selfEnd: css({
    alignSelf: 'end',
  }),
  alignStart: css({
    alignItems: 'flex-start',
  }),
  alignCenter: css({
    alignItems: 'center',
  }),
  alignEnd: css({
    alignItems: 'flex-end',
  }),
  alignStretch: css({
    alignItems: 'stretch',
  }),
  justifyStart: css({
    justifyContent: 'flex-start',
  }),
  justifyCenter: css({
    justifyContent: 'center',
  }),
  justifyBetween: css({
    justifyContent: 'space-between',
  }),
  justifyAround: css({
    justifyContent: 'space-around',
  }),
  justifyEvenly: css({
    justifyContent: 'space-evenly',
  }),
  justifyEnd: css({
    justifyContent: 'flex-end',
  }),
  xThin: css({
    fontWeight: '100',
  }),
  thin: css({
    fontWeight: '300',
  }),
  bold: css({
    fontWeight: '700',
  }),
  xBold: css({
    fontWeight: '900',
  }),
  pointer: css({
    cursor: 'pointer',
  }),
}
