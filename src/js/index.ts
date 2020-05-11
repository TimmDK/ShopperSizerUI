import axios, {
    AxiosResponse,
    AxiosError
} from "../../node_modules/axios/index";

interface ILiveNumber{
    id:number;
    number:number;
}

let baseurl = "https://shoppersizerrest.azurewebsites.net/api/LiveNumber/1"

new Vue({
    el: ".app",
    data:{
        liveNumber: 0,
        remaining:0,
        maxvalue: 200,
    },
    methods:{
        getLiveNumber(){
            axios.get<ILiveNumber>(baseurl)
            .then((response: AxiosResponse<ILiveNumber>)=>{
                this.LiveNumber = response.data.number
                this.getRemainingValue()
                console.log(response.data)
            })
            .catch((error: AxiosError)=>{
                this.errorMessage = error.message
            })
        },
        getRemainingValue(){
            this.remaining = this.maxvalue - this.LiveNumber
        },
          keepUpdating(){
              setInterval(this.getLiveNumber,2000)
          },
    },
    created(){
        this.getLiveNumber()
    },
    mounted(){
          this.keepUpdating()
    },
    
})

/* CHART VIEW PAGE */

/* Imports */
import * as am4core from "../../node_modules/@amcharts/amcharts4/core"
import * as am4charts from "../../node_modules/@amcharts/amcharts4/charts"
import am4themes_animated from "../../node_modules/@amcharts/amcharts4/themes/animated"
import { any } from "../../node_modules/@amcharts/amcharts4/.internal/core/utils/Array";

// Theme
am4core.useTheme(am4themes_animated)

// Creates chart
let chart = am4core.create("chartDiv", am4charts.XYChart)

// Add data
chart.data = [{
    "country": "USA",
    "visits": 2025
  }, {
    "country": "China",
    "visits": 1882
  }, {
    "country": "Japan",
    "visits": 1809
  }, {
    "country": "Germany",
    "visits": 1322
  }, {
    "country": "UK",
    "visits": 1122
  }, {
    "country": "France",
    "visits": 1114
  }, {
    "country": "India",
    "visits": 984
  }, {
    "country": "Spain",
    "visits": 711
  }, {
    "country": "Netherlands",
    "visits": 665
  }, {
    "country": "Russia",
    "visits": 580
  }, {
    "country": "South Korea",
    "visits": 443
  }, {
    "country": "Canada",
    "visits": 441
  }, {
    "country": "Brazil",
    "visits": 395
  }]

  // Create axes

let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
categoryAxis.dataFields.category = "country";
categoryAxis.renderer.grid.template.location = 0;
categoryAxis.renderer.minGridDistance = 30;

categoryAxis.renderer.labels.template.adapter.add("dy", function(dy, target) {
  if (target.dataItem && target.dataItem.index & 2 == 2) {
    return dy + 25;
  }
  return dy;
});

let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

// Create series
let series = chart.series.push(new am4charts.ColumnSeries());
series.dataFields.valueY = "visits";
series.dataFields.categoryX = "country";
series.name = "Visits";
series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
series.columns.template.fillOpacity = .8;

let columnTemplate = series.columns.template;
columnTemplate.strokeWidth = 2;
columnTemplate.strokeOpacity = 1;


