import React from 'react'
import RSpring, { animated } from 'react-spring'

interface ISpinnerProps {
  transition: RSpring.TransitionFn<boolean, { opacity: number }>
}

//Changed spinner file name so it is not failing cloning the project
const Spinner = ({ transition }: ISpinnerProps) => {
  return (
    <>
      {transition((style, condition) =>
        condition ? (
          ''
        ) : (
          <animated.div className='box-spinner' style={style}>
            <span>🤼‍♂️</span>
          </animated.div>
        )
      )}
    </>
  )
}

export default Spinner
