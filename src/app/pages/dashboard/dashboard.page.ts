import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  @ViewChild('monthly_colection_by_lo') monthly_colection_by_lo;
  @ViewChild('monthly_colection_by_rights') monthly_colection_by_rights;
  @ViewChild('barChart') barChart;
  @ViewChild('bar2Chart') bar2Chart;
  // @ViewChild('bar3Chart') bar3Chart;
  @ViewChild('bar4Chart') bar4Chart;
  // @ViewChild('bar5Chart') bar5Chart;
  @ViewChild('bar6Chart') bar6Chart;
  @ViewChild('bar7Chart') bar7Chart;

  bars: any;
  bars2: any;
  // bars3: any;
  bars4: any;
  // bars5: any;
  bars6: any;
  bars7: any;
  model: any = {};
  colorArray: any;
  collection_report_chart_by_lo: any;
  collection_report_chart_by_right: any;

  bar_options = {
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };
  years: any[];
  months: any[]=['01','02','03','04','05','06','07','08','09','10','11','12'];
  params: any={};
  OutstandingPI: any;
  outstanding_ati: any;
  constructor(
    private apiService: ApiService,
  ) {
    this.years = []; 
    for(let i = new Date().getFullYear(); i > 2010; i--) { 
      this.years.push(i);
    } 
  }


  ionViewDidEnter() {
    this.createBarChart();
  }

  createBarChart() {
    this.collection_report_chart_by_lo = new Chart(
      this.monthly_colection_by_lo.nativeElement,
      {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Collection',
          data: [],
          backgroundColor: '#87CEFA', // array should have same number of elements as number of dataset
          borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
          borderWidth: 1
        },
        {
          label: 'count',
          data: [],
          backgroundColor: '#87CEFA', // array should have same number of elements as number of dataset
          borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
          borderWidth: 1
        }]
      },
        options: this.bar_options,
      }
    );

    this.collection_report_chart_by_right = new Chart(this.monthly_colection_by_rights.nativeElement, {
      type: 'bar',
      data: {
        labels: ['S1', 'S2', 'S3', 'S4', 'S5'],
        datasets: [{
          label: 'Collection',
          data: [1000, 2000, 3000, 4000, 5000],
          backgroundColor: '#87CEFA', // array should have same number of elements as number of dataset
          borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'x',
        scales: {
          x: {
            grid: {
              display: false
            }
          },
        },
      }
    }
    );

    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Amount',
            data: [],
            // data2: [1,4,6,7,8],
            backgroundColor: '#87CEFA', // array should have same number of elements as number of dataset
            borderColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
          {
            label: 'Count',
            data: [],
            // data2: [1,4,6,7,8],
            backgroundColor: '#87CEFA', // array should have same number of elements as number of dataset
            borderColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
        ],
      },
      options: this.bar_options,
    });
    this.bars2 = new Chart(this.bar2Chart.nativeElement, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Amount',
            data: [],
            backgroundColor: 'rgb(255,192,203)', // array should have same number of elements as number of dataset
            borderColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
          {
            label: 'count',
            data: [],
            backgroundColor: 'rgb(255,192,203)', // array should have same number of elements as number of dataset
            borderColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
        ],
      },
      options: this.bar_options,
    });
    // this.bars3 = new Chart(this.bar3Chart.nativeElement, {
    //   type: 'bar',
    //   data: {
    //     labels: ['South', 'North', 'East', 'West' ],
    //     datasets: [{
    //       label: 'Sales Growth',
    //       data: [ 10, 17,18, 20],
    //       backgroundColor: [
    //         // 'rgba(110, 114, 20, 1)',
    //         '#dfb7ff',
    //         '#cc94ff',
    //         '#b66fff',
    //         '#9d47ff'
    //       ], // array should have same number of elements as number of dataset
    //       borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
    //       borderWidth: 1
    //     }]
    //   },
    //   options: {
    //     indexAxis: 'y',
    //     scales: {
    //       x: {
    //         grid: {
    //           display: false
    //         }
    //       },
    //       y: {
    //         grid: {
    //           display: false
    //         }
    //       }
    //     }
    //   },
    // });
    this.bars4 = new Chart(this.bar4Chart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['30 Days', '60 Days', '90 Days'],
        datasets: [
          {
            label: 'Receivable Days Outstanding for ATI',
            data: [],
            backgroundColor: '#87CEFA', // array should have same number of elements as number of dataset
            borderColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
          {
            label: 'Count',
            data: [],
            backgroundColor: '#87CEFA', // array should have same number of elements as number of dataset
            borderColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
        ],
      },
      options: this.bar_options,
    });
    // this.bars5 = new Chart(this.bar5Chart.nativeElement, {
    //   type: 'doughnut',
    //   data: {
    //     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun' ],
    //     datasets: [{
    //       label: 'Sales Growth',
    //       data: [10, 17,18, 20,22,27],
    //       backgroundColor: [
    //         '#F0F8FF',
    //         '#E6E6FA',
    //         '#B0E0E6',
    //         '#ADD8E6',
    //         '#87CEFA',
    //         '#87CEEB'
    //       ], // array should have same number of elements as number of dataset
    //       borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
    //       borderWidth: 1
    //     }]
    //   },
    //   options: {
    //     rotation:  -90,
    //     circumference: 180
    //   }
    // });
    this.bars6 = new Chart(this.bar6Chart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['30 Days', '60 Days', '90 Days'],
        datasets: [
          {
            label: 'Receivable Days Outstanding for PI',
            data: [],
            backgroundColor: 'rgb(255,192,203)', // array should have same number of elements as number of dataset
            borderColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
          {
            label: 'Count',
            data: [],
            backgroundColor: 'rgb(255,192,203)', // array should have same number of elements as number of dataset
            borderColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
        ],
      },
      options: this.bar_options,
    });
    this.bars7 = new Chart(this.bar7Chart.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['30', '60', '90'],
        datasets: [
          {
            label: 'Sales Growth',

            data: [],
            backgroundColor: ['#ffddf4', '#ffc1cc', '#f4c2c2'], // array should have same number of elements as number of dataset
            borderColor: 'rgb(255,192,203)', // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
        ],
      },
      options: {
        rotation: -90,
        circumference: 180,
      },
    });
  }
  ngOnInit() {
    this.getList();
  }

  getList() {
    let params: any = {...this.params};
    
    this.apiService.callapi(this.apiService.APIS.DASHBOARD_COLLECTIONS, params).subscribe(res=>{
      console.log(res);
      this.model.userdata = res.userdata;
      this.model.cdata = res.data;
      this.model.collection_by_lo = res.collection_by_lo;
      this.model.right_collection = res.right_collection;
      this.model.sales_by_region = res.sales_by_region;

        this.model.pending_ati = res.pending_ati;
        this.bars2.data.labels = [];
        this.bars2.data.datasets[0].data = [];
        this.bars2.data.datasets[1].data = [];
        this.model.pending_ati.filter((e) => {
          this.bars2.data.labels.push(e._id[0].name);
          this.bars2.data.datasets[0].data.push(e.totalSaleAmount);
          this.bars2.data.datasets[1].data.push(e.count);
        });

        this.bars2.update();

        this.model.pending_pi = res.pending_pi;
        this.bars.data.labels = [];
        this.bars.data.datasets[0].data = [];
        this.bars.data.datasets[1].data = [];
        this.model.pending_pi.filter((e) => {
          this.bars.data.labels.push(e._id[0].name);
          this.bars.data.datasets[0].data.push(e.totalSaleAmount);
          this.bars.data.datasets[1].data.push(e.count);
        });

        this.bars.update();

        //License expire details
        this.model.LicensesDetails = [];
        this.model.LicensesDetails = res.LicensesDetails;
        this.bars7.data.datasets[0].data = [];
        this.model.LicensesDetails.filter((e) => {
          this.bars7.data.datasets[0].data.push(e.count);
        });
        this.bars7.update();

        this.getCollectionbyRights();

        this.model.OutstandingPI = [];
        this.model.OutstandingPI = res.OutstandingPI;
        this.bars6.data.datasets[0].data = [];
        this.bars6.data.datasets[1].data = [];
        this.model.OutstandingPI.filter((e) => {
          this.bars6.data.datasets[0].data.push(e.total);
          this.bars6.data.datasets[1].data.push(e.count);
        });
        this.bars6.update();

        this.model.outstanding_ati = [];
        this.model.outstanding_ati = res.OutstandingPI;
        this.bars4.data.datasets[0].data = [];
        this.bars4.data.datasets[1].data = [];
        this.model.outstanding_ati.filter((e) => {
          this.bars4.data.datasets[0].data.push(e.total);
          this.bars4.data.datasets[1].data.push(e.count);
        });
        this.bars4.update();
     
      // this.getSalesByRegion();
      this.getCollectionbylo();
    });
  }

  getCollectionbyRights() {
    let templabels = [];
    let tempcdata = [];
    this.model.right_collection.filter(c => {
          templabels.push(c.code);
          tempcdata.push(c.total);
    });
    this.collection_report_chart_by_right.data.labels = templabels;
    this.collection_report_chart_by_right.data.datasets[0].data = tempcdata;
    this.collection_report_chart_by_right.update();
  }

  getCollectionbylo() {
    let templabels = [];
    let tempcdata = [];
    let tempcdata1 = [];

    this.model.collection_by_lo.filter(e=>{
      templabels.push(e._id[0].name);
      tempcdata.push(e.totalSaleAmount);
      tempcdata1.push(e.count);
    });

    this.collection_report_chart_by_lo.data.labels = templabels
    this.collection_report_chart_by_lo.data.datasets[0].data = tempcdata;
    this.collection_report_chart_by_lo.data.datasets[1].data = tempcdata1;
    this.collection_report_chart_by_lo.update();
  }

  // getSalesByRegion(){
  //   let templabels = [];
  //   let tempcdata = [];
  //   console.log(this.model.sales_by_region);
  //   this.model.sales_by_region.filter(c => {
  //         templabels.push(c.name);
  //         tempcdata.push(c.collection);
  //   });
  //   this.bars3.data.labels = templabels;
  //   this.bars3.data.datasets[0].data = tempcdata;
  //   this.bars3.update();
  // }
}
