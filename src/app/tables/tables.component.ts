import { Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { of } from 'rxjs'; 
import { GridApi, FirstDataRenderedEvent, GridReadyEvent } from 'ag-grid-community';


@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})

export class TablesComponent implements OnInit {
  public gridApi!: GridApi;



  columnDefs = [
    { field: 'Dimension', sortable: true, filter: true}, // checkboxSelection: true, rowGroup: true},
    { field: 'Date', sortable: true, filter: true},
    { field: 'Quantity', sortable: true, filter: true},
    { field: 'Volume (GEL)', sortable: true, filter: true},
    { field: 'Average (GEL)', sortable: true, filter: true},
    { field: 'Difference quantity', sortable: true, filter: true},
    { field: 'Difference volume', sortable: true, filter: true},
];



  public rowData!: Observable<any[]>;

  public rowSelection = 'multiple';
  public rowGroupPanelShow = 'always';
  public pivotPanelShow = 'always';
  public paginationPageSize = 10;



  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
  
  
  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.paginationGoToPage(0);
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement).value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

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
        var dataDict = { Dimension: dataItem.dimension, 
        Date: '', 
        Quantity: "", 
        'Volume (GEL)': dataItem.volume, 
        'Average (GEL)': "", 
        'Difference quantity': "", 
        'Difference volume': "" }

        datalist_1.push(dataDict)
          
      }
      
      this.rowData = of(datalist_1)
      let chart1Row = (data) => {
        this.rowData = of(datalist_1)
      }  
  
      // function chart1Row(data) {
      //   this.rowData = of(datalist_1)
      // }
        
      var button = document.getElementById("chart1");
      button?.addEventListener("click", chart1Row)
  
      // this.rowData = of(datalist_1)

    }) 

    this.http.post<any>(app_url, body2).subscribe(D => {

      var datalist_2: any[] = [];
      for (var dataItem of D.data) {
        var dataDict = { Dimension: dataItem.dimension, 
        Date: dataItem.gteDate,
        Quantity: dataItem.quantity,
        'Volume (GEL)': dataItem.volume, 
        'Average (GEL)': "", 
        'Difference quantity': "", 
        'Difference volume': "" }

        datalist_2.push(dataDict)

      }

      let chart1Row = (data) => {
        this.rowData = of(datalist_2)
      }  

      var button = document.getElementById("chart2");
      button?.addEventListener("click", chart1Row)

    })


    this.http.post<any>(app_url2, body3).subscribe(D => {
      
      var datalist_3: any[] = [];
      for (var dataItem of D.data.entities) {
        var dataDict = { Dimension: dataItem.dimension, 
        Date: dataItem.date,
        Quantity: "",
        'Volume (GEL)': dataItem.volume, 
        'Average (GEL)': "", 
        'Difference quantity': "", 
        'Difference volume': "" }

        datalist_3.push(dataDict)

      }

      let chart3Row = (data) => {
        console.log(11)
        this.rowData = of(datalist_3)
      }  

      var button = document.getElementById("chart3");
      button?.addEventListener("click", chart3Row)

    })







  }
}

