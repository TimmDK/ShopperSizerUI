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

let baseurl = "https://shoppersizerrest.azurewebsites.net/api/LiveNumber/1"
let limitUrl = "https://shoppersizerrest.azurewebsites.net/api/LimitNumber/1"

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
      data: [50, 26, 19, 91, 85, 10, 84, 18, 49, 92, 13, 99, 10]
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
    }
  },
  created() {
    this.getLiveNumber()
    this.getLimitNumber()
    this.generateXaxisData()
  },
  mounted() {
    this.keepUpdating()
  },

})

/* CHART VIEW PAGE */
