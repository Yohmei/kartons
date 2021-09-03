import React from 'react'
import page_hoc from '../Page'

const NotFound = () => {
  return (
    <div className='content' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <h1>NOT FOUND</h1>
    </div>
  )
}

export default page_hoc(NotFound, '😢')
