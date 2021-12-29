export const formatData = (data) => {
    let finalData = {
      labels: [],
      datasets: [
        {
          label: "Price",
          data: [],
          backgroundColor: "rgb(255, 99, 132, 0.8)",
          borderColor: "rgba(255, 99, 132, 0.2)",
          fill: false
        }
      ]
    };
    
    let dates = data.map((val) => {
      const ts = val[0];
      let date = new Date(ts * 1000);
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      // console.log('ts =',ts)
      // console.log('date =',date)
      // console.log('day =',day)
      // console.log('month =',month)
      // console.log('year =',year)
  
      let final = `${day}-${month}-${year}`;
      return final;
    });
    
    // let arr = [1,2,3]
    // console.log('arr.re =',arr.reverse())

    let priceArr = data.map((val) => {
      return val[4];
    });
    // console.log('priceArr =',priceArr)
    priceArr.reverse();   //กลับ Array
    //console.log('priceArr.reverse(); =',priceArr.reverse())
    dates.reverse();
    finalData.labels = dates;
    finalData.datasets[0].data = priceArr;
    // console.log('finalData.datasets[0].data =',finalData.datasets[0].data)
    return finalData;
  };
  