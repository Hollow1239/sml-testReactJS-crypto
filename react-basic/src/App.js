// import logo from './logo.svg';

import './App.css';
import Nav from './components/navigation'
import Content from './components/contents'
import Web3 from 'web3'
import React, { useState, useEffect, useRef } from "react";
import Dashboard from "../src/components/dashboard/Dashboard.js";
import { formatData } from "./utils";
import "./styles.css";
import useRefresh from './utils/useRefresh'

function App() {
  const { fastRefresh } = useRefresh()
  const [currencies, setcurrencies] = useState([]);
  const [pair, setpair] = useState("");
  const [pairKUB, setpairKUB] = useState("");
  const [price, setprice] = useState("0.00");
  const [pastData, setpastData] = useState({});
  const [ethvalue, setEthvalue] = useState('')
  const [USDTvalue, setUSDTvalue] = useState('')
  const [priceETH, setpriceETH] = useState('')
  const [priceKUB, setpriceKUB] = useState('')
  const [priceUSDT, setpriceUSDT] = useState('')
  const ws = useRef(null);
  const wsKUB = useRef(null);

  // const [user, setuser] = useState()
  // const [hasError, sethasError] = useState()
  const [account, setAccount] = useState()
  const [chainId, setchainId] = useState()
  const [web3, setweb3] = useState()

  let symETH = 'THB_ETH'


  window.ethereum.on('accountsChanged', function (accounts) {
    setAccount(accounts[0])
  })

  window.ethereum.on('networkChanged', function (networkId) {
    setchainId(networkId)
    // Time to reload your interface with the new networkId
  })

  useEffect(() => {
    const getWeb3 = async () => {
      if (typeof Web3 !== 'undefined') {
        let web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546'); // inject from Metamask plugin

        window.ethereum.enable(); //connect metamask
        setweb3(web3)
        // console.log('web3 = ', web3)

      }
    }
    getWeb3()
  }, [account, chainId])

  let first = useRef(false);
  const url = "https://api.pro.coinbase.com";

  // let second = useRef(false);
  const urlKUB = "https://api.bitkub.com/api/market/ticker";
  // const urlKUB2 = "https://api.bitkub.com/websocket-api?streams=market.trade.thb_btc";


  useEffect(() => {
    // var wsKUB = new WebSocket("wss://api.bitkub.com/websocket-api/market.trade.thb_btc,market.ticker.thb_btc");
    var wsKUB = new WebSocket("wss://api.bitkub.com/websocket-api/market.trade.thb_btc,market.trade.thb_eth");

    wsKUB.onopen = function () {
      console.log('Conneted wsKUB'); //เมื่อ connect จะ clg
    }

    wsKUB.onerror = function (error) {
      console.error('WebSocket Error =', error);
    };

    let wsData = [];
    wsKUB.onmessage = async (e) => {
      console.log("message from server: ", JSON.parse(e.data));
      wsData = JSON.parse(e.data)
      // console.log('wsData = ',wsData.sym,'asd',wsData.rat)
      if (wsData.sym === symETH) {
        console.log('wsData = ', wsData.sym, 'asd', wsData.rat)
        setpriceETH(wsData.rat)
      }

    };


    let pairsKUB = [];

    const apiCall = async () => {
      await fetch(urlKUB)                      //fetch มาจาก API
        .then((res) => {
          // console.log('jsonKUB =', res);
          return res.json()
        })   //แปลงเป็น JSON                             
        .then((data) => {
          return pairsKUB = data      //โยนค่าใส่ Arr
        })
      console.log('pairsKUB =', pairsKUB.THB_USDT.last);
      setpriceKUB(pairsKUB.THB_USDT.last)
      // console.log('USDT = ',pairsKUB.THB_USDT.last)


    };
    // setpairKUB('thb_btc')
    apiCall();

    // return () => setpriceKUB('')
  }, []);//fastRefresh

  useEffect(() => {
    ws.current = new WebSocket("wss://ws-feed.pro.coinbase.com");
    // console.log('ws.current = ',ws.current)
    let pairs = [];

    const apiCall = async () => {
      await fetch(url + "/products")                      //fetch มาจาก API
        .then((res) => {
          // console.log('json =', res.json);
          return res.json()
        })   //แปลงเป็น JSON                             
        .then((data) => {
          // console.log('pairs =',data);
          return pairs = data      //โยนค่าใส่ Arr
        })

      let filtered = pairs.filter((pair) => {
        if (pair.quote_currency === "USD") { //กรองเอาเฉพาะ quote_currency = USD 
          // console.log('RETURN =', pair)
          return pair;
        }
      });

      filtered = filtered.sort((a, b) => {  //sort แบบ เข้าถึง field จะใช้ในกรณีที่ Arr เป็น Object
        if (a.base_currency < b.base_currency) {
          return -1;
        }
        if (a.base_currency > b.base_currency) {
          return 1;
        }
        return 0;
      });
      // console.log('filtered =', filtered);


      setcurrencies(filtered);

      first.current = true;
      // console.log('first.current =', first.current)
    };
    // setpair("ETH-USD")
    apiCall();
  }, []);

  useEffect(() => {
    if (!first.current) {
      // console.log('retu=')
      return;
    }


    let msg = {
      type: "subscribe",
      product_ids: [pair],
      channels: ["ticker"]
    };
    let jsonMsg = JSON.stringify(msg); //แปลงกลับไปเป็น JSON 
    // console.log('jsonMsg = ',jsonMsg)
    ws.current.send(jsonMsg);
    let historicalDataURL = `${url}/products/${pair}/candles?granularity=86400`;

    const fetchHistoricalData = async () => {
      let dataArr = [];
      await fetch(historicalDataURL)
        .then((res) => res.json())
        .then((data) => (dataArr = data));

      // console.log('dataArr =', dataArr)
      let formattedData = formatData(dataArr);
      // console.log('formattedData =', formattedData)
      setpastData(formattedData);
    };
    fetchHistoricalData();


    // let msgETH = {
    //   type: "subscribe",
    //   product_ids: [ethvalue],
    //   channels: ["ticker"]
    // };
    // let jsonMsgETH = JSON.stringify(msgETH); //แปลงกลับไปเป็น JSON 
    // ws.current.send(jsonMsgETH);
    // let historicalDataURLETH = `${url}/products/${ethvalue}/candles?granularity=86400`;
    // const fetchHistoricalDataETH = async () => {
    //   let dataArr = [];
    //   await fetch(historicalDataURLETH)
    //     .then((res) => res.json())
    //     .then((data) => (dataArr = data));

    //   // console.log('dataArrETH =', dataArr)
    //   let formattedData = formatData(dataArr);
    //   // console.log('formattedDataETH =', formattedData)
    //   // setpastData(formattedData);
    // };
    // fetchHistoricalDataETH();

    // let msgUSDT = {
    //   type: "subscribe",
    //   product_ids: [USDTvalue],
    //   channels: ["ticker"]
    // };
    // let jsonMsgUSDT = JSON.stringify(msgUSDT); //แปลงกลับไปเป็น JSON 
    // ws.current.send(jsonMsgUSDT);
    // let historicalDataURLUSDT = `${url}/products/${USDTvalue}/candles?granularity=86400`;
    // const fetchHistoricalDataUSDT = async () => {
    //   let dataArr = [];
    //   await fetch(historicalDataURLUSDT)
    //     .then((res) => res.json())
    //     .then((data) => (dataArr = data));

    //   // console.log('dataArrETH =', dataArr)
    //   let formattedData = formatData(dataArr);
    //   // console.log('formattedDataETH =', formattedData)
    //   // setpastData(formattedData);
    // };
    // fetchHistoricalDataUSDT();


    ws.current.onmessage = (e) => {
      let data = JSON.parse(e.data); //แปลงข้อมูลเป็น JS object
      if (data.type !== "ticker") {
        return;
      }

      if (data.product_id === pair) {
        setprice(data.price);
      }

      // if (data.product_id === ethvalue) {

      //   setpriceETH(data.price)
      //   // console.log('data.price = ', data.price)
      // }
      // if (data.product_id === USDTvalue) {

      //   setpriceUSDT(data.price)
      //   // console.log('data.price = ', data.price)
      // }
    };
  }, [pair]);

  const handleSelect = (e) => {
    let unsubMsg = {
      type: "unsubscribe",
      product_ids: [pair],
      channels: ["ticker"]
    };
    let unsub = JSON.stringify(unsubMsg);

    ws.current.send(unsub);
    setpair(e.target.value);
    //console.log("e =",e)


    // let unsubETHMsg = {
    //   type: "unsubscribe",
    //   product_ids: [ethvalue],
    //   channels: ["ticker"]
    // };
    // let unsubETH = JSON.stringify(unsubETHMsg);
    // ws.current.send(unsubETH);
    // setEthvalue("ETH-USD")

    // let unsubUSDTMsg = {
    //   type: "unsubscribe",
    //   product_ids: [USDTvalue],
    //   channels: ["ticker"]
    // };
    // let unsubUSDT = JSON.stringify(unsubUSDTMsg);
    // ws.current.send(unsubUSDT);
    // setUSDTvalue("USDT-USD")
  };





  return (
    <div className="App">
      <Nav Web3={web3} priceETH={priceETH} priceUSDT={priceUSDT} priceKUB={priceKUB} />

      <div className="container">
        {
          <select name="currency" value={pair} onChange={handleSelect}>
            {currencies.map((cur, idx) => {
              return (
                <option key={idx} value={cur.id}>
                  {cur.display_name}
                </option>
              );
            })}
          </select>
        }
        <Dashboard price={price} data={pastData} />
      </div>
      <Content Web3={web3} />
    </div>
  );
}

export default App;
