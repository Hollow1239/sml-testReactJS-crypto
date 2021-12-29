import React, { useState, useEffect } from "react";

import { CRYPTO_COMPARE } from "../keys";
import { TradingViewEmbed, widgetType } from "react-tradingview-embed";

import {
  XYPlot,
  Hint,
  LineSeries,
  FlexibleXYPlot,
  VerticalBarSeries,
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis,
  AreaSeries
} from "react-vis";

var formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"


});
// console.log('formatter: ',formatter)

export function Dashboard() {




  // const [times, setTimes] = useState()
  // const [high, setHigh] = useState()
  // const [low, setLow] = useState()
  const [chartData, setChartData] = useState([])
  const [query, setQuery] = useState('BTC')
  // const [leaderboard, setLeaderboard] = useState()
  const [addressData, setAddressData] = useState()
  const [symbol, setSymbol] = useState()

  useEffect(() => {
    loadChartData();
    // console.log('state: ', state)
  }, [])


  const loadChartData = async () => {
    const response = await fetch(
      `https://min-api.cryptocompare.com/data/blockchain/histo/day?fsym=${query}&api_key=${CRYPTO_COMPARE}&limit=30`
    );
    const data = await response.json();
    const bulkData = data.Data.Data;
    console.log('bulkData: ', bulkData)
    const dataArray = [];
    {
      //this needs to be updated to time, active_addresses, average_transaction_value, current_supply, new_addresses,
      // symbol, transaction_count, transaction_count_all_time
      // bulkData.map((y) =>
      //   dataArray.push({
      //     time: y.time,
      //     active_addresses: y.active_addresses,
      //     average_transaction_value: y.average_transaction_value,
      //     current_supply: y.current_supply,
      //     symbol: y.symbol,
      //     transaction_count: y.transaction_count,
      //     transaction_count_all_time: y.transaction_count_all_time
      //   })
      // );
      bulkData.map((y) =>
        dataArray.push({
          x: y.time * 1000,
          y: y.transaction_count * y.average_transaction_value
        })
      );
      console.log('dataArray: ', dataArray)
    }

    setChartData(dataArray)
    setQuery(query)
  };


  const handleInputChange = (e) => {
    setQuery(e.taget.value)
  };



  return (
    <div>
      <div className="inputDiv">
        {/* <h1>{formatter}</h1> */}
        <input
          placeholder="Search for a symbol"
          // ref={(input) => (search = input)}
          onChange={(e) => handleInputChange(e)}
          className="dataRequest"
        />
        <button onClick={loadChartData} className="dataRequest">
          Load Onchain Data
        </button>

        <TradingViewEmbed
          widgetType={widgetType.TICKER_TAPE}
          widgetConfig={{
            showSymbolLogo: true,
            // isTransparent: true,
            displayMode: "adaptive",
            colorTheme: "dark",
            autosize: true,
            symbols: [
              {
                proName: "BITSTAMP:ETHUSD",
                title: "ETH/USD"
              },
              {
                proName: "BITSTAMP:BTCUSD",
                title: "BTC/USD"
              },
              {
                proName: "BINANCE:BNBUSDT",
                title: "BNB/USDT"
              },
              {
                proName: "BINANCE:ADAUSD",
                title: "ADA/USD"
              },
              {
                proName: "BINANCE:DOGEUSDT",
                title: "DOGE/USDT"
              },
              {
                proName: "UNISWAP:UNIUSDT",
                title: "UNI/USDT"
              }
            ]
          }}
        />
      </div>
      <div className="charty">
        <h3 style={{ color: "white" }}>ADVANCED_CHART</h3>
        {query.length > 2 ? (
          <TradingViewEmbed
            widgetType={widgetType.ADVANCED_CHART}
            widgetConfig={{
              interval: "1D",
              colorTheme: "dark",
              width: "100%",
              symbol: query + "USD",
              studies: [
                "MACD@tv-basicstudies",
                "StochasticRSI@tv-basicstudies",
                "TripleEMA@tv-basicstudies"
              ]
            }}
          />
        ) : (
          "BTCUSD"
        )}

        <h3 style={{ color: "white" }}>ECONOMIC_CALENDAR</h3>
        {query.length > 2 ? (
          <TradingViewEmbed
            widgetType={widgetType.ECONOMIC_CALENDAR}
            widgetConfig={{
              // interval: "1D",
              colorTheme: "dark",
              width: "100%",
              // symbol: query + "USD",
              // studies: [
              //   "MACD@tv-basicstudies",
              //   "StochasticRSI@tv-basicstudies",
              //   "TripleEMA@tv-basicstudies"
              // ]
            }}
          />
        ) : (
          "BTCUSD"
        )}

        <h3 style={{ color: "white" }}>FOREX_CROSS_RATES</h3>
        <TradingViewEmbed
          widgetType={widgetType.FOREX_CROSS_RATES}
          widgetConfig={{
            // interval: "1D",
            // colorTheme: "dark",
            width: "100%",
            // symbol: query + "USD",
            // studies: [
            //   "MACD@tv-basicstudies",
            //   "StochasticRSI@tv-basicstudies",
            //   "TripleEMA@tv-basicstudies"
            // ]
          }}
        />

        <h3 style={{ color: "white" }}>FOREX_HEATMAP</h3>
        <TradingViewEmbed
          widgetType={widgetType.FOREX_HEATMAP}
          widgetConfig={{
            // interval: "1D",
            // colorTheme: "dark",
            width: "100%",
            // symbol: query + "USD",
            // studies: [
            //   "MACD@tv-basicstudies",
            //   "StochasticRSI@tv-basicstudies",
            //   "TripleEMA@tv-basicstudies"
            // ]
          }}
        />

        <h3 style={{ color: "white" }}>FUNDAMENTAL_DATA</h3>
        <TradingViewEmbed
          widgetType={widgetType.FUNDAMENTAL_DATA}
          widgetConfig={{
            // interval: "1D",
            colorTheme: "dark",
            width: "100%",
            symbol: query + "USD",
            // studies: [
            //   "MACD@tv-basicstudies",
            //   "StochasticRSI@tv-basicstudies",
            //   "TripleEMA@tv-basicstudies"
            // ]
          }}
        />

        <h3 style={{ color: "white" }}>MARKET_DATA</h3>
        <TradingViewEmbed
          widgetType={widgetType.MARKET_DATA}
          widgetConfig={{
            // interval: "1D",
            colorTheme: "dark",
            width: "100%",
            // symbol: query + "USD",
            // studies: [
            //   "MACD@tv-basicstudies",
            //   "StochasticRSI@tv-basicstudies",
            //   "TripleEMA@tv-basicstudies"
            // ]
          }}
        />

        <h3 style={{ color: "white" }}>MARKET_OVERVIEW</h3>
        <TradingViewEmbed
          widgetType={widgetType.MARKET_OVERVIEW}
          widgetConfig={{
            // interval: "1D",
            colorTheme: "dark",
            width: "100%",
            // symbol: query + "USD",
            // studies: [
            //   "MACD@tv-basicstudies",
            //   "StochasticRSI@tv-basicstudies",
            //   "TripleEMA@tv-basicstudies"
            // ]
          }}
        />

        <h3 style={{ color: "white" }}>MINI_CHART</h3>
        <TradingViewEmbed
          widgetType={widgetType.MINI_CHART}
          widgetConfig={{
            // interval: "1D",
            colorTheme: "dark",
            width: "100%",
            symbol: query + "USD",
            // studies: [
            //   "MACD@tv-basicstudies",
            //   "StochasticRSI@tv-basicstudies",
            //   "TripleEMA@tv-basicstudies"
            // ]
          }}
        />

        <h3 style={{ color: "white" }}>SCREENER</h3>
        <TradingViewEmbed
          widgetType={widgetType.SCREENER}
          widgetConfig={{
            // interval: "1D",
            colorTheme: "dark",
            width: "100%",
            symbol: query + "USD",
            // studies: [
            //   "MACD@tv-basicstudies",
            //   "StochasticRSI@tv-basicstudies",
            //   "TripleEMA@tv-basicstudies"
            // ]
          }}
        />

        <h3 style={{ color: "white" }}>SCREENER_CRYPTOCURRENCY</h3>
        <TradingViewEmbed
          widgetType={widgetType.SCREENER_CRYPTOCURRENCY}
          widgetConfig={{
            // interval: "1D",
            colorTheme: "dark",
            width: "100%",
            symbol: query + "USD",
            // studies: [
            //   "MACD@tv-basicstudies",
            //   "StochasticRSI@tv-basicstudies",
            //   "TripleEMA@tv-basicstudies"
            // ]
          }}
        />

        <h3 style={{ color: "white" }}>SYMBOL_INFO</h3>
        <TradingViewEmbed
          widgetType={widgetType.SYMBOL_INFO}
          widgetConfig={{
            // interval: "1D",
            colorTheme: "dark",
            width: "100%",
            symbol: query + "USD",
            // studies: [
            //   "MACD@tv-basicstudies",
            //   "StochasticRSI@tv-basicstudies",
            //   "TripleEMA@tv-basicstudies"
            // ]
          }}
        />

        <h3 style={{ color: "white" }}>SYMBOL_OVERVIEW</h3>
        <TradingViewEmbed
          widgetType={widgetType.SYMBOL_OVERVIEW}
          widgetConfig={{
            // interval: "1D",
            colorTheme: "dark",
            width: "100%",
            symbol: query + "USD",
            // studies: [
            //   "MACD@tv-basicstudies",
            //   "StochasticRSI@tv-basicstudies",
            //   "TripleEMA@tv-basicstudies"
            // ]
          }}
        />

        <h3 style={{ color: "white" }}>STOCK_MARKET</h3>
        <TradingViewEmbed
          widgetType={widgetType.STOCK_MARKET}
          widgetConfig={{
            // interval: "1D",
            colorTheme: "dark",
            width: "100%",
            symbol: query + "USD",
            // studies: [
            //   "MACD@tv-basicstudies",
            //   "StochasticRSI@tv-basicstudies",
            //   "TripleEMA@tv-basicstudies"
            // ]
          }}
        />

        <h3 style={{ color: "white" }}>TECHNICAL_ANALYSIS</h3>
        <TradingViewEmbed
          widgetType={widgetType.TECHNICAL_ANALYSIS}
          widgetConfig={{
            interval: "1D",
            colorTheme: "dark",
            width: "100%",
            symbol: query + "USD",
            // studies: [
            //   "MACD@tv-basicstudies",
            //   "StochasticRSI@tv-basicstudies",
            //   "TripleEMA@tv-basicstudies"
            // ]
          }}
        />

        <h3 style={{ color: "white" }}>TICKER</h3>
        <TradingViewEmbed
          widgetType={widgetType.TICKER}
          widgetConfig={{
            interval: "1D",
            colorTheme: "dark",
            width: "100%",
            symbol: query + "USD",
            // studies: [
            //   "MACD@tv-basicstudies",
            //   "StochasticRSI@tv-basicstudies",
            //   "TripleEMA@tv-basicstudies"
            // ]
          }}
        />

        <h3 style={{ color: "white" }}>TICKER_SINGLE</h3>
        <TradingViewEmbed
          widgetType={widgetType.TICKER_SINGLE}
          widgetConfig={{
            interval: "1D",
            colorTheme: "dark",
            width: "100%",
            symbol: query + "USD",
            // studies: [
            //   "MACD@tv-basicstudies",
            //   "StochasticRSI@tv-basicstudies",
            //   "TripleEMA@tv-basicstudies"
            // ]
          }}
        />

        <h3 style={{ color: "white" }}>TICKER_TAPE</h3>
        <TradingViewEmbed
          widgetType={widgetType.TICKER_TAPE}
          widgetConfig={{
            interval: "1D",
            colorTheme: "dark",
            width: "100%",
            symbol: query + "USD",
            // studies: [
            //   "MACD@tv-basicstudies",
            //   "StochasticRSI@tv-basicstudies",
            //   "TripleEMA@tv-basicstudies"
            // ]
          }}
        />

      </div>

      <div className="taChart">
        <div className="addressHover">
          {/* <HoverHint
              data={addressData}
              query={query}
              symbol={symbol}
            /> */}

        </div>

        {/* <div>
          <h1>chart</h1>
          <Chart />
          </div> */}

        <FlexibleXYPlot className="onChainChart" height={500}>
          <VerticalBarSeries
            data={chartData}
            opacity={0.3}
            color={"#40FEFF"}
            onNearestX={(datapoint, event) => {

              setAddressData({
                time: new Date(datapoint.x).toLocaleDateString(),
                price: datapoint.y
              })
              console.log('addressData: ', addressData);
            }
            }
          />

          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis
            tickFormat={(value) =>
              new Date(value).toLocaleDateString().split(" ")
            }
            tickValues={chartData.x}
            title={"Dates"}
            style={{
              line: { stroke: "#ffffff" },
              ticks: { stroke: "#ffffff" },
              text: {
                stroke: "none",
                fill: "#ffffff",
                fontWeight: 3,
                fontSize: 8,
                position: "start"
              },
              title: { fill: "#ffffff" }
            }}
          />
          <YAxis
            tickFormat={(value) => value / 1}
            width={40}
            tickValues={chartData.y}
            // title={"Active Number of Addresses"}
            style={{
              line: { stroke: "#ffffff", marginRight: 50 },
              ticks: { stroke: "#fffff" },
              text: {
                stroke: "none",
                fill: "#ffffff",
                fontWeight: 3,
                fontSize: 7,
                position: "start"
              },
              title: { fill: "#ffffff" }
            }}
          />
        </FlexibleXYPlot>
        {query.length > 2 ? (
          <TradingViewEmbed
            widgetType={widgetType.TECHNICAL_ANALYSIS}
            widgetConfig={{
              interval: "1D",
              colorTheme: "dark",
              width: "100%",
              symbol: query + "USD"
            }}
          />
        ) : (
          query
        )}

        {query.length > 2 ? (
          <TradingViewEmbed
            widgetType={widgetType.COMPANY_PROFILE}
            widgetConfig={{
              colorTheme: "dark",
              width: "100%",
              symbol: query + "USD"
            }}
          />
        ) : (
          "BTCUSD"
        )}
      </div>

      {/* {chartData.map((x) => (
        <Chart
          key={x.x}
          time={x.x}
          symbol={x.key}
          active_addresses={x.y}
        // average_transaction_value={x.average_transaction_value}
        // current_supply={x.current_supply}
        // transaction_count={x.transaction_count}
        // transaction_count_all_time={x.transaction_count_all_time}
        />
      ))} */}
    </div>
  );

}

const Chart = (props) => {
  return (
    <div>
      <div className="chart">
        <p className="chart-data" key={props.time}>
          {"time" + props.time}
        </p>
        <p className="chart-data" key={props.active_addresses}>
          {"active addresses" + props.active_addresses}
        </p>
        {/* <p className="chart-data">{moment(props.time * 1000).format("L")}</p>
        <p className="chart-data">{'Average Transaction ' + props.average_transaction_value}</p>
        <p className="chart-data">{'Active Addresses ' + props.active_addresses}</p>
        <p className="chart-data">{'Current Supply ' + props.current_supply}</p>
        <p className="chart-data">{'Transaction Count ' + props.transaction_count}</p>
        <p className="chart-data">{'Transaction Count All Time ' + props.transaction_count_all_time}</p> */}
      </div>
    </div>
  );
};

const Leader = (props) => {
  return (
    <div className="leaderItem">
      <a href={props.url} target="#">
        <img src={props.logo} alt={props.symbol} className="logo" />
      </a>
      <p className="leaderText">{props.symbol}</p>
      <p className="leaderText">{props.price}</p>
    </div>
  );
};

const HoverHint = ({ active, data, query, symbol }) => (
  <div className={`nonActive ${active ? "active" : ""}`}>
    <p className="hoverData">
      {data.length > 1
        ? query
        : symbol.toUpperCase() +
        "  - Raw Averaged Volume (Transactions * Average Value $USD)"}
    </p>
    <p className="hoverData">
      {data.length < 1 ? "" : data.time + " - " + formatter.format(data.price)}{" "}
    </p>
    {/* <p className="hoverData">{data.length > 1 ? "Number of Addresses" + data.price : data.price}</p> */}
  </div>
);


