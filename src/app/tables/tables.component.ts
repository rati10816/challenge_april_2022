import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { HttpClient } from '@angular/common/http';
import { PeriodicElement } from '../Interface/PeriodicElement';


var ELEMENT_DATA: PeriodicElement[] = [
]

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit {
  ngOnInit(): void {
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

    var i = 0;
    this.http.post<any>(app_url, body4).subscribe(D => {
      ELEMENT_DATA = [];
      for (var dataItem of D.data.slice(1, 21)) {
        ELEMENT_DATA.push(dataItem);
        // console.log(date, transactions, volume)
      }
      console.log(ELEMENT_DATA);

    })
  }

  displayedColumns: string[] = ['dimension', 'volume'];

  @ViewChild('paginator')
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private http: HttpClient
  ) { }
  dataSource!: MatTableDataSource<PeriodicElement>;

  annouceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce('sorted ${sortState.direction}ending')
    } else {
      this._liveAnnouncer.announce('Sorted Cleared')
    }
  }
  ngAfterContentInit() {
    this.dataSource = new MatTableDataSource(ELEMENT_DATA)
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
