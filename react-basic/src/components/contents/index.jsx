import React, { useState, useMemo, useEffect } from 'react'
import Web3 from 'web3'
import '../contents/index.css'
var Accounts = require('web3-eth-accounts');

function Content(props) {
    const { Web3 } = props
    let web3 = Web3
    const [balance, setbalance] = useState(300)
    const [SimpleContract, setSimpleContract] = useState()
    const [account, setaccount] = useState()
    const [set, setSet] = useState(true)
    const [accName, setaccName] = useState()
    const [ETH, setETH] = useState()

    const log = async (txt, val) => {
        console.log(txt + ' = ', val)

    }

    const getAccountName = async (account) => {
        // console.log('account =',account)
        switch (account[0]) {
            case '0xf3C3D7349eD9834eAA8566eda99ed0C3F29F7461':
                setaccName('Account 1')
                break
            case '0xAf1002eC4E9202a7F8d80619Bf5AfbEAf547C64f':
                setaccName('Account 2')
                break
            case '0xb68815Dc309f75156C3c369092107B50f71DB13e':
                setaccName('Account 3')
                break
            case '0x5090cAe7F3e042287af55F4B3FFe617dCA4009ba':
                setaccName('Account 4')
                break
        }

    }

    useEffect(() => {
        const getBalance2 = async () => {
            let account = await web3.eth.getAccounts();
            // console.log('getAccount =', account)
            setaccount(account)
            let balance = await web3.eth.getBalance(account[0])
            let ETH = web3.utils.fromWei(balance, "ether")
            // console.log('ETH =', ETH)
            setETH(ETH)
        }




        if (web3) {
            getBalance2()
            var contractAddress = '0x01fD55DF686859C9daD5a3CAD806380dd13Ea028';            
            var abi = [{ "constant": false, "inputs": [{ "name": "newBalance", "type": "uint256" }], "name": "setBalance", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "constant": true, "inputs": [], "name": "getBalance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }];            
            var SimpleContractContract = new web3.eth.Contract(abi, contractAddress);
            setSimpleContract(SimpleContractContract);

            getBalance(SimpleContractContract);
        }
    }, [set, Web3])


    useEffect(() => {

        

        const main = async () => {

            await getAccountName(account)
            // log('Address', account)
            // log('accName', accName)
        }
        if (account) {
            main()
        }

    }, [account, accName])

    function addStatusLine(text) {
        document.getElementById("status").innerHTML = text + "<br/><br/>" + document.getElementById("status").innerHTML;
    }
    async function getBalance(e) {

        addStatusLine("");
        addStatusLine("calling getBalance");
        // console.log(e)
        let num = await e.methods.getBalance().call()
        setbalance(num)
    }
    async function setBalance(e) {

        e.preventDefault()
        let newBalance = parseInt(document.getElementById('newBalance').value);
        setSet(!set)
        await SimpleContract.methods.setBalance(newBalance).send({ from: account })
            .then(function (res) {

                getBalance(SimpleContract)
            });
    }

    async function setTest(e) {

        e.preventDefault()
        // console.log('Fn setTest')        

    }
    
    return (
        <div className="container">
            <h1>Dapp Basic Example</h1>
            <div><h2>{accName} : {account} </h2> </div>

            <div className = 'fake'>
            {/* <img className="identicon identicon__image-border rounded-circle" src="https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=014"   /> */}
            {/* <h2 className="ETH"> {ETH} ETH</h2> */}
            </div>
            <h2 id="balance">Current Balance = <span id="currentBalance" />  {balance}</h2>
            <button id="button" style={{ display: 'block' }} onClick={() => getBalance(SimpleContract)}>Get New Balance</button>
            <hr />
            <br />
            <label htmlFor="newBalance" className="col-lg-2 control-label"><strong>New Balance</strong></label>
            <input id="newBalance" type="number" defaultValue={300} style={{ display: 'inline-block' }} />
            <button id="button" style={{ display: 'inline-block' }} onClick={(e) => setBalance(e)}>Set New Balance</button>
            <button id="set" style={{ display: 'inline-block' }} onClick={(e) => setTest(e)}>Set</button>
            <br />
            <label><strong>Status</strong></label>
            <h4 id="status" />

        </div>
    )
}

export default React.memo(Content)