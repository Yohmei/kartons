import React from 'react'

const WalletSummary = () => {
  return (
    <div className='item wallet-summary'>
      <h4 className='item-header'>Wallet</h4>
      <div className='wallet'>
        <span>Total</span>
        <span>{'4927'.replace(/(?=.{3}$)/, ' ')}</span>
      </div>
      <div className='wallet'>
        <span>Savings</span>
        <span>500</span>
      </div>
      <p className='item-sub-header'>Expenses</p>
      <div className='wallet'>
        <span>Rent</span>
        <span>-995</span>
      </div>
      <div className='wallet'>
        <span>Food</span>
        <span>-300</span>
      </div>
      <div className='wallet'>
        <span>Electricity</span>
        <span>-90</span>
      </div>
    </div>
  )
}

export default WalletSummary
