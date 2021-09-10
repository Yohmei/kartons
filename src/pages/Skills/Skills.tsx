import React, { useEffect, useState } from 'react'
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from 'recharts'
import { s, sa } from '../../utils'
import page_hoc from '../Page'

const Skills = () => {
  const [retry, set_retry] = useState<string[]>([])
  const [data, set_data] = useState([
    {
      subject: 'Math',
      A: 20,
    },
    {
      subject: 'Chin',
      A: 20,
    },
    {
      subject: 'Engl',
      A: 20,
    },
    {
      subject: 'Geog',
      A: 40,
    },
    {
      subject: 'Phys',
      A: 20,
    },
    {
      subject: 'Hist',
      A: 30,
    },
  ])

  useEffect(() => {
    if (s('.recharts-polar-angle-axis-tick-value') && retry[0] !== 'done') {
      sa('.recharts-polar-angle-axis-tick-value')[3].style.transform = 'translateY(8px)'
      set_retry(['done'])
    } else if (retry.length === 0) set_retry([])
  }, [retry])

  return (
    <div className='content'>
      <ResponsiveContainer width='100%' height='100%'>
        <RadarChart cx='50%' cy='50%' data={data}>
          <PolarGrid gridType='circle' />
          <PolarAngleAxis dataKey='subject' />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar name='Mike' dataKey='A' fill='#042A2B' stroke='#e8e0c4' fillOpacity={0.4} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default page_hoc(Skills, 'Skills')
