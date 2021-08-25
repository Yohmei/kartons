import React, { useState } from 'react'
import { get_local_wallet } from '../../local_storage/fin_storage'
import page_hoc from '../Page'

const Finances = () => {
  const [wallet_state] = useState(get_local_wallet())

  return (
    <div className='content'>
      <div className='cont'>
        <div className='list-item'>
          <h4>Current Period</h4>
        </div>
        {wallet_state.map((wallet) => {
          return (
            <div key={wallet.id} className='list-item'>
              <h4>Year {wallet.year}</h4>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default page_hoc(Finances, 'Finances')
