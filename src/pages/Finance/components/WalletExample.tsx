import React from 'react'
import { capitalise_first } from '../../../utils'

const WalletExample = () => {
  return (
    <div className='wallet-input-cont'>
      <p className='sub-header'>{capitalise_first('Expenses')}</p>
      <div className={`${'Expenses'}-table table`}>
        <div className='table-header'>
          <div className='table-header-item'>Category</div>
          <div className='table-header-item'>Details</div>
          <div className='table-header-item'>Amount</div>
        </div>
        <div className='table-body'>
          <div className='table-row'>
            <div className='table-item'>
              <span>{capitalise_first('Paps')}</span>
            </div>
            <div className='table-item'>
              <span>{capitalise_first('Supa')}</span>
            </div>
            <div className='table-item'>
              <span>{'350'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WalletExample
