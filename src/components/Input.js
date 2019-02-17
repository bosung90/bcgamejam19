import React from 'react'
import { css } from 'emotion'

export default React.forwardRef((props, ref) => {
  const { className, style, ...restProps } = props
  return <input ref={ref} {...restProps} className={css(styles.baseStyle, className, style)} />
})

const styles = {
  baseStyle: css({
    paddingLeft: 10,
    height: 30,
    borderWidth: 3,
    borderColor: '#7235A1',
    borderStyle: 'solid',
    borderRadius: 30,
    fontSize: 18,
  }),
}
