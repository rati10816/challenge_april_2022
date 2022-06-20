import { Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, range } from 'rxjs';
import { of } from 'rxjs'; 
import { GridApi, FirstDataRenderedEvent, GridReadyEvent, StandardMenuFactory } from 'ag-grid-community';
import {FormGroup, FormControl} from '@angular/forms';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
// import { start } from 'repl';


@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})

export class TablesComponent implements OnInit {
  public gridApi!: GridApi;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

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
    this.paginationPageSize =(Number(value));
    console.log(this.paginationPageSize)
  }

  constructor(private http: HttpClient) {

  }

  ngOnInit() {

    var body1

    // Get date range and generate body1
    this.range.valueChanges.subscribe(x => {
      var startDate
      var endDate

      if (x.start != null && x.end == null) {
        startDate = new Date(x.start).toISOString().slice(0, 10);
        
        body1 = {
          "dimension": "parent-category",
          "types": [
            "spending", "withdrawal"
          ],
          "gteDate": startDate,
          "includes": [
            "volume", "quantity", "date", "dimension", "average", "differenceVolume", "differenceQuantity"
          ],
          "pageSize": this.paginationPageSize
        }  


        this.http.post<any>(app_url, body1).subscribe(D => {

          var datalist_1: any[] = [];
          for (var dataItem of D.data.entities) {
            var dataDict = { Dimension: dataItem.dimension, 
            Date: dataItem.date, 
            Quantity: dataItem.quantity, 
            'Volume (GEL)': dataItem.volume, 
            'Average (GEL)': dataItem.average, 
            'Difference quantity': dataItem.differenceQuantity, 
            'Difference volume': dataItem.differenceVolume }
    
            datalist_1.push(dataDict)
              
          }
          
          this.rowData = of(datalist_1)
          let chart1Row = (data) => {
            this.rowData = of(datalist_1)
          }  
            
          var button = document.getElementById("chart1");
          button?.addEventListener("click", chart1Row)
    
        }) 
        
      }

      if (x.end != null && x.start == null) {
        endDate = new Date(x.end).toISOString().slice(0, 10);
        
        body1 = {
          "dimension": "parent-category",
          "types": [
            "spending", "withdrawal"
          ],
          "lteDate": endDate,
          "includes": [
            "volume", "quantity", "date", "dimension", "average", "differenceVolume", "differenceQuantity"
          ],
          "pageSize": this.paginationPageSize
        }  
        
        this.http.post<any>(app_url, body1).subscribe(D => {

          var datalist_1: any[] = [];
          for (var dataItem of D.data.entities) {
            var dataDict = { Dimension: dataItem.dimension, 
            Date: dataItem.date, 
            Quantity: dataItem.quantity, 
            'Volume (GEL)': dataItem.volume, 
            'Average (GEL)': dataItem.average, 
            'Difference quantity': dataItem.differenceQuantity, 
            'Difference volume': dataItem.differenceVolume }
    
            datalist_1.push(dataDict)
              
          }
          
          this.rowData = of(datalist_1)
          let chart1Row = (data) => {
            this.rowData = of(datalist_1)
          }  
            
          var button = document.getElementById("chart1");
          button?.addEventListener("click", chart1Row)
    
        }) 

      }

      else if (x.end != null && x.start != null) {
        startDate = new Date(x.start).toISOString().slice(0, 10);
        endDate = new Date(x.end).toISOString().slice(0, 10);

        body1 = {
          "dimension": "parent-category",
          "types": [
            "spending", "withdrawal"
          ],
          "gteDate": startDate,
          "lteDate": endDate,
          "includes": [
            "volume", "quantity", "date", "dimension", "average", "differenceVolume", "differenceQuantity"
          ],
          "pageSize": this.paginationPageSize
        }  
       
        this.http.post<any>(app_url, body1).subscribe(D => {

          var datalist_1: any[] = [];
          for (var dataItem of D.data.entities) {
            var dataDict = { Dimension: dataItem.dimension, 
            Date: dataItem.date, 
            Quantity: dataItem.quantity, 
            'Volume (GEL)': dataItem.volume, 
            'Average (GEL)': dataItem.average, 
            'Difference quantity': dataItem.differenceQuantity, 
            'Difference volume': dataItem.differenceVolume }
    
            datalist_1.push(dataDict)
              
          }
          
          this.rowData = of(datalist_1)
          let chart1Row = (data) => {
            this.rowData = of(datalist_1)
          }  
            
          var button = document.getElementById("chart1");
          button?.addEventListener("click", chart1Row)
    
        }) 

      }

   })

    const body2 = {
      "dimension": "date",
      "types": [
        "spending", "withdrawal"
      ],
      "gteDate": "2018-01-01",
      "lteDate": "2018-01-31",
      "includes": [
        "volume", "quantity", "date"
      ],
      "pageSize": 20
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
      "includes": ["dimension", "date", "volume", "quantity", "average", "differenceVolume", "differenceQuantity"],
    }

    const app_url = 'https://api.next.insight.optio.ai/api/v2/analytics/transactions/facts/find'


    this.http.post<any>(app_url, body2).subscribe(D => {

      var datalist_2: any[] = [];
      for (var dataItem of D.data.entities) {
        var dataDict = { Dimension: dataItem.dimension, 
        Date: dataItem.date,
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

    this.http.post<any>(app_url, body3).subscribe(D => {
      
      var datalist_3: any[] = [];
      for (var dataItem of D.data.entities) {
        var dataDict = { Dimension: dataItem.dimension, 
        Date: dataItem.date,
        Quantity: dataItem.quantity,
        'Volume (GEL)': dataItem.volume, 
        'Average (GEL)': dataItem.average, 
        'Difference quantity': dataItem.differenceQuantity, 
        'Difference volume': dataItem.differenceVolume
      }

        datalist_3.push(dataDict)

      }

      let chart3Row = (data) => {

        this.rowData = of(datalist_3)
      }  

      var button = document.getElementById("chart3");
      button?.addEventListener("click", chart3Row)

    })




  }
}

