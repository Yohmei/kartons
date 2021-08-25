import React from 'react'

interface IVideoProp {
  video_src: any
}

const Video = ({ video_src }: IVideoProp) => {
  return (
    <div className='fullscreen-bg'>
      <video autoPlay muted loop className='fullscreen-bg__video'>
        <source src={video_src} type='video/mp4' />
      </video>
    </div>
  )
}

export default Video
