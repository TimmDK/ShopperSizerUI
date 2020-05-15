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
let dataSetUrl = "https://shoppersizerrest.azurewebsites.net/api/datasets/date"

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
        id: 'vuechart',
        zoom: {
          enabled: false
        }
      },
      xaxis: {
        categories: [],
        //tickPlacement: 'on'
      }
    },
    series: [{
      name: 'Antal kunder',
      data: [1]
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
        .then((response: AxiosResponse<ILimitNumber>) => {
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
      let ln: HTMLInputElement = <HTMLInputElement>document.getElementById("valueInput")
      axios.put<ILimitNumber>(limitUrl, { id: 1, limitTal: Number(ln.value) })
        .then((response: AxiosResponse<ILimitNumber>) => {
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
      //setInterval(this.generateYaxisData, 2000)
      setInterval(this.changeColorMaxValue, 100)
    },
    generateXaxisData() {
      for (let index = this.openingHour; index < this.closingHour + 1; index++) {
        this.options.xaxis.categories.push(index)
      }
    },
    generateYaxisData() {
      let date = new Date();

      //let today = String(date.getDate()) + "-" + String(date.getMonth() + 1)
      let today = String(date.getMonth() + 1) + "-" + String(date.getDate())

      axios.get<IDataSets[]>(dataSetUrl + "/" + today)
        .then((response: AxiosResponse<IDataSets[]>) => {
          
          let countArray = new Array<number>(24)
          let newData: IDataSets[] = []          
          
          for (let i = 0; i < response.data.length; i++) {
            if(response.data[i] != null)
            {
              newData[i] = response.data[i] 
            }
          }

          for (let index = this.openingHour; index < this.closingHour + 1; index++) {
            newData.forEach(element => {
              var str = String(element.date)
              var splitted = str.split("")
              var hour = Number(splitted[11]+splitted[12])

              if(hour == index)
              countArray[hour+1] = (element.count)
            });          
          }

          for (let index = 0; index < countArray.length; index++) {
            if(typeof(countArray[index]) == 'undefined')
            {
              countArray[index] = 0
            }  
          }
          //console.log(countArray)

          var result = countArray.slice(this.openingHour, this.closingHour+1)
          //console.log(result)
          

          this.series = [{
            data: result
          }]
        })
        .catch((error: AxiosError) => {
          console.log(error.message)
        })

      

    },
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
