import React from 'react'

interface Props {
  children: React.ReactNode
  layout?: 'flex' | 'grid'
  direction?: 'row' | 'col'
  justify?: 'center' | 'start' | 'end' | 'between' | 'around' | 'evenly'
  align?: 'center' | 'start' | 'end' | 'stretch' | 'baseline'
  className?: string
  gap?: number
}

export const Container = (props: Props) => {
  const {
    children,
    layout = 'flex',
    direction = 'col',
    justify = 'center',
    align = 'center',
    className = '',
    gap = 0,
  } = props

  const gapStyle = gap ? `gap-${gap}` : ''
  const directionStyle = `flex-${direction}`
  const justifyStyle = `justify-${justify}`
  const alignStyle = `items-${align}`
  const classes = `${layout}  ${directionStyle} ${justifyStyle} ${alignStyle} ${gapStyle} ${className}`

  return <div className={classes}>{children}</div>
}
