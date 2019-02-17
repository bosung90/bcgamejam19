import React from 'react'
import { css } from 'emotion'

export default React.forwardRef((props, ref) => {
  const { className, style, ...restProps } = props
  return <button ref={ref} {...restProps} className={css(styles.baseStyle, className, style)} />
})

const styles = {
  baseStyle: css({
    fontFamily: 'Nunito',
    margin: 6,
    height: 40,
    backgroundColor: '#7235A1',
    borderRadius: 30,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    minWidth: 100,
    cursor: 'pointer',
    padding: 6,
    paddingLeft: 20,
    paddingRight: 20,
  }),
}