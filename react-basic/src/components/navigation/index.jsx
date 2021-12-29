import React, { useState, useEffect } from 'react'
import '../navigation/indexnav.css'

export default function Index(props) {
    const { Web3, priceETH, priceUSDT, priceKUB } = props
    const [value, setValue] = useState('')
    const [account, setAccount] = useState()
    const [ETH, setETH] = useState()
    // const [bath, setBath] = useState('')

    useEffect(() => {
        const getBalance2 = async () => {
            // console.log(Web3)
            let account = await Web3.eth.getAccounts();
            // setAccount(account)
            let balance = await Web3.eth.getBalance(account[0])
            let ETH = Web3.utils.fromWei(balance, "ether")
            // console.log("ETH =", ETH)
            setETH(ETH)
        }
        if (Web3) {
            getBalance2()
        }



    }, [Web3])

    return (
        <nav className="navbar " >
            <div className="container-fluid"  >


                <div style={{ display: 'flex' }}>
                    <img className=' mx-1' src="https://app.nafter.io/static/media/logo.a985c3ee.png" alt="" style={{ height: '38px' }} />
                    <div className='fake-input'>

                        <input className="form-control me-2 input-radius" type="search" placeholder="Search" aria-label="Search" onChange={(e) => setValue(e.target.value)} />
                    </div>
                    <button className="btn btn-outline-success btm-search " type="submit" onClick={(e) => { e.preventDefault(); console.log(value) }}   >Button</button>
                </div>

                <div className='d-flex gap-3 '>
                <div className='d-flex border rounded p-1' > 
                    <img className="identicon identicon__image-border rounded-circle" src="https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=014" />
                        <h4 className='my-auto'>{priceETH} ฿</h4>
                     
                    </div>
                    <h4 className='my-auto'>{parseFloat(ETH).toFixed(4)} ETH</h4>
                  
                    {/* <h4 className='CurrentETH'>{priceUSDT} USDT</h4> */}
                    {/* <h4 className='CurrentETH'>{priceKUB} BAHT</h4> */}
                    {/* <h5 className='CurrentBath'>{(priceKUB*priceETH).toFixed(4)} ฿</h5> */}
                </div>


            </div>
        </nav>

    )
}
