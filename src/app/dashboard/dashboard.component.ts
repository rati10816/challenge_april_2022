import { Component, OnInit, } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as echarts from 'echarts';
import { MatTableDataSource } from '@angular/material/table';
import { min } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  headers = ["Company", "Amount"]

  rows;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {

    const body1 = {
      "dimension": "parent-category",
      "types": [
        "spending", "withdrawal"
      ],
      "gteDate": "2018-01-01",
      "lteDate": "2018-01-31",
      "includeMetrics": [
        "volume"
      ]
    }

    const body2 = {
      "dimension": "date",
      "types": [
        "spending", "withdrawal"
      ],
      "gteDate": "2018-01-01",
      "lteDate": "2018-01-31",
      "includeMetrics": [
        "volume", "quantity"
      ]
    }

    const body3 = {
      "dimension": "category",
      "types": [
        "income"
      ],
      "gteDate": "2018-01-01",
      "lteDate": "2018-01-31",
      "sortBy": "date",
      "sortDirection": "asc",
      "pageIndex": 0,
      "pageSize": 50,
      "includes": ["dimension", "date", "volume"]
    }
    const body4 = {
      "dimension": "merchant",
      "types": [
        "none"
      ],
      "gteDate": "2018-01-01",
      "lteDate": "2018-01-31",
      "includeMetrics": [
        "volume"
      ]
    }
    
    const app_url = 'https://api.next.insight.optio.ai/api/v2/analytics/transactions/facts/aggregate'
    const app_url2 = 'https://api.next.insight.optio.ai/api/v2/analytics/transactions/facts/find'

    
    this.http.post<any>(app_url, body1).subscribe(D => {

      var datalist_1: any[] = [];

      for (var dataItem of D.data) {
        var item = { value: dataItem.volume, name: dataItem.dimension };
        datalist_1.push(item);
      }

      chart1(datalist_1)
    })


    this.http.post<any>(app_url, body2).subscribe(D => {

      var chartDataVolume: any[] = [];
      var chartDataQuantity: any[] = [];
      for (var dataItem of D.data) {
        const wd = [6,5,4,3,2,1,0];
        var weekDay = wd[new Date(dataItem.dimension).getDay()];
        
        var weekNumber =  new Date(dataItem.dimension);
        const date = weekNumber.getDate();
        const day = weekNumber.getDay();
        const weekOfMonth = Math.ceil((date - 1 - day) / 7);

        chartDataVolume.push([
          weekDay,
          weekOfMonth,
          dataItem.volume
        ]);
        
        chartDataQuantity.push([
          weekDay,
          weekOfMonth,
          dataItem.quantity
        ]);
      }

      // get week numbers
      var weeksNumber = D.data[0].dimension;
      var year = weeksNumber.slice(0,4)
      var month = weeksNumber.slice(5,7)
      
      var button = document.getElementById("button");
      button?.addEventListener("click", quantity)
      
      var button1 = document.getElementById("button1");
      button1?.addEventListener("click", volume)

      chart2(chartDataQuantity, "Quantity", year, month)
     function quantity() {
      chart2(chartDataQuantity, "Quantity", year, month);
     }
     
     function volume(){
       chart2(chartDataVolume, "Volume", year, month);
     }

    })

    this.http.post<any>(app_url2, body3).subscribe(D => {

      var categoryList: any[] = [];
      var dateList: any[] = [];

      var SalaryIncomeList: any[] = [];
      var DepositsList: any[] = [];
      var BonusList: any[] = [];
      var OtherList: any[] = [];
      var DividendList: any[] = [];

      for (var dataItem of D.data.entities) {
        var date = dataItem.date;
        var category = dataItem.dimension;
        categoryList.push(category)
        dateList.push(date.substring(0, 10))
        if (dataItem.dimension == 'Salary') {
          SalaryIncomeList.push(dataItem.volume)
        } else if (dataItem.dimension == 'Income From Deposits') {
          DepositsList.push(dataItem.volume)
        } else if (dataItem.dimension == 'Bonus') {
          BonusList.push(dataItem.volume)
        } else if (dataItem.dimension == 'Other Income') {
          OtherList.push(dataItem.volume)
        } else if (dataItem.dimension == 'Dividend') {
          DividendList.push(dataItem.volume)
        }
      }
      
      // remove duplicates
      dateList = dateList.filter((item,
        index) => dateList.indexOf(item) === index)

      chart3(categoryList, dateList, SalaryIncomeList, DepositsList, BonusList, OtherList, DividendList)

    })
    
    this.http.post<any>(app_url, body4).subscribe(D => {

      var sortedData = D.data.sort(function(a, b) {
        return b.volume - a.volume
    }).slice(0, 20);

    var counter = 1
    var rowList:  any[] = [];
    for (var dataItem of sortedData) {

      var rowDict = {
        "Company" : counter + ". " + dataItem.dimension,
        "Amount" : dataItem.volume
      } 
      counter ++
      rowList.push(rowDict)
      this.rows = rowList
    }

    })

  }

}


function chart1(chart1_data) {

  type EChartsOption = echarts.EChartsOption;

  var chartDom = document.getElementById('main')!;
  var myChart = echarts.init(chartDom);
  var option: EChartsOption;

  option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '40',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: chart1_data
      }
    ]
  };

  option && myChart.setOption(option);

}

function chart2(chart2_data, chart2_name, year, month_number) {

  var dom = document.getElementById("container")!;
  var myChart = echarts.init(dom);
  var app = {};

  var option;
  
  var hours: any[] = [];

  // count weeks in the month
  weekCount(year, month_number)

  function weekCount(year, month_number) {
console.log(month_number)
    var firstOfMonth = new Date(year, month_number-1, 1);
    var lastOfMonth = new Date(year, month_number, 0);

    var used = firstOfMonth.getDay() + lastOfMonth.getDate();

    for (var i = 1; i <= Math.ceil( used / 7); i++) {
      hours.push(i);
    }
}
  
  // prettier-ignore
  const days = [
    'Saturday', 
    'Friday', 
    'Thursday',
    'Wednesday', 
    'Tuesday', 
    'Monday', 
    'Sunday'
  ];
  // prettier-ignore
  const data = chart2_data.map(function (item) {
      return [item[1], item[0], item[2] || '-'];
    });
  option = {
    tooltip: {
      position: 'top'
    },
    grid: {
      height: '50%',
      top: '10%'
    },
    xAxis: {
      type: 'category',
      data: hours,
      splitArea: {
        show: true
      }
    },
    yAxis: {
      type: 'category',
      data: days,
      splitArea: {
        show: true
      }
    },
    visualMap: {
      min: 0,
      max: 10,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '15%'
    },
    series: [
      {
        name: chart2_name,
        type: 'heatmap',
        data: data,
        label: {
          show: true
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  if (option && typeof option === 'object') {
    myChart.setOption(option);
  }

}

function chart3(categoryList, dateList, SalaryIncomeList, DepositsList, BonusList, OtherList, DividendList) {
  var dom = document.getElementById("container1")!;
  var myChart = echarts.init(dom);
  var app = {};

  var option;



  option = {
    title: {
      text: 'Incomes'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: categoryList
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dateList
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: categoryList[0],
        type: 'line',
        stack: 'Total',
        data: SalaryIncomeList
      },
      {
        name: categoryList[1],
        type: 'line',
        stack: 'Total',
        data: DepositsList
      },
      {
        name: categoryList[2],
        type: 'line',
        stack: 'Total',
        data: BonusList
      },
      {
        name: categoryList[3],
        type: 'line',
        stack: 'Total',
        data: OtherList
      },
      {
        name: categoryList[4],
        type: 'line',
        stack: 'Total',
        data: DividendList
      }
    ]
  };
  
  // console.log(option);

  if (option && typeof option === 'object') {
    myChart.setOption(option);
  }

}
