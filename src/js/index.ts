import axios, {
  AxiosResponse,
  AxiosError
} from "../../node_modules/axios/index";

import VueApexCharts from '../../node_modules/vue-apexcharts/dist/vue-apexcharts';

Vue.component('apexchart', VueApexCharts)

interface ILiveNumber {
  id: number;
  number: number;
}

interface ILimitNumber {
  id: number
  limitTal: number
}

interface IDataSets {
  id: number
  count: number
  date: Date
}

let baseurl = "https://shoppersizerrest.azurewebsites.net/api/LiveNumber/1"
let limitUrl = "https://shoppersizerrest.azurewebsites.net/api/LimitNumber/1"
let dataSetUrl = "https://shoppersizerrest.azurewebsites.net/api/datasets"

new Vue({
  el: ".app",
  components: {
    apexcharts: VueApexCharts,
  },

  data: {
    liveNumber: 0,
    remaining: 0,
    maxvalue: 100,
    newvalue: 3000,
    valueColor: "green",
    openingHour: 8,
    closingHour: 20,

    options: {
      chart: {
        id: 'vuechart-example',
      },
      xaxis: {
        categories: []
      }
    },
    series: [{
      name: 'Antal kunder',
      data: [1,2,3,4,5,6,6,7,8,5,34,32]
    }],



  },
  methods: {
    getLiveNumber() {
      axios.get<ILiveNumber>(baseurl)
        .then((response: AxiosResponse<ILiveNumber>) => {
          this.liveNumber = response.data.number
          this.getRemainingValue()
          console.log(response.data)
        })
        .catch((error: AxiosError) => {
          this.errorMessage = error.message
        })
    },
    getRemainingValue() {
      this.remaining = this.maxvalue - this.liveNumber
    },
    getLimitNumber() {
      axios.get<ILimitNumber>(limitUrl)
      .then((response: AxiosResponse<ILimitNumber>) =>{
        this.maxvalue = response.data.limitTal
        
      })
      .catch((error: AxiosError) => {
        this.errorMessage = error.message
        console.log(error.message)
      })
    },
    getDataSets() {
      axios.get<IDataSets[]>(dataSetUrl)
      .then((response: AxiosResponse<IDataSets[]>) => {
        console.log(response.data)
        console.log(response.data.length)
      })
      .catch((error: AxiosError) => {
        console.log(error.message)
      })  
    },
    putLimitNumber() {
      let ln : HTMLInputElement = <HTMLInputElement> document.getElementById("test") 
      axios.put<ILimitNumber>(limitUrl, {id: 1, limitTal : Number(ln.value)})
      .then((response: AxiosResponse<ILimitNumber>)=> {
        console.log("rettet")
        this.getLimitNumber()
      })
      .catch((error: AxiosError) => {
        console.log(error.message)
      })
    },
    changeColorMaxValue() {
      if (this.liveNumber >= (this.maxvalue / 100) * 50 && this.liveNumber <= (this.maxvalue / 100) * 75) {
        this.valueColor = "orange"
      } else if (this.liveNumber >= (this.maxvalue / 100) * 75) {
        this.valueColor = "red"
      } else {
        this.valueColor = "green"
      }
    },
    keepUpdating() {
      setInterval(this.getLiveNumber, 2000)
      setInterval(this.changeColorMaxValue, 100)
    },
    generateXaxisData() {
      for (let index = this.openingHour; index < this.closingHour+1; index++) {
        this.options.xaxis.categories.push(index)
      }
    },
    generateYaxisData() {
//       const dataset: IDataSets[] = this.getDataSets()
//       console.log(dataset)

//       const array = ["one", "two", "three"]
// dataset.forEach(function (item, index) {
//   console.log(item, index);
// });
      
axios.get<IDataSets[]>(dataSetUrl)
.then((response: AxiosResponse<IDataSets[]>) => {
  console.log(this.series.data)
  let array : number[]
  response.data.forEach(element => {
    this.series.data += element.count
  });
  console.log(this.series.data)
})
.catch((error: AxiosError) => {
  console.log(error.message)
})  

    }
  },
  created() {
    this.getLiveNumber()
    this.getLimitNumber()
    this.generateXaxisData()
    this.generateYaxisData()
  },
  mounted() {
    this.keepUpdating()
  },

})

/* CHART VIEW PAGE */
