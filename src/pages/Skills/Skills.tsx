import React, { useState } from 'react'
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from 'recharts'
import page_hoc from '../Page'

const Skills = () => {
  const [data, set_data] = useState([
    {
      subject: 'Math',
      A: 10,
    },
    {
      subject: 'Chin',
      A: 10,
    },
    {
      subject: 'Engl',
      A: 10,
    },
    {
      subject: 'Geog',
      A: 30,
    },
    {
      subject: 'Phys',
      A: 10,
    },
    {
      subject: 'Hist',
      A: 10,
    },
  ])

  return (
    <div className='content'>
      <ResponsiveContainer width='100%' height='100%'>
        <RadarChart cx='50%' cy='50%' data={data}>
          <PolarGrid gridType='circle' />
          <PolarAngleAxis dataKey='subject' />
          <Radar name='Mike' dataKey='A' fill='#ffd97d' fillOpacity={0.97} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default page_hoc(Skills, 'Skills')
