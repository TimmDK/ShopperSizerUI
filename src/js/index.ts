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

interface IStoreHours {
  openingHour: number
  closingHour: number
}

interface IUser {
  id: number
  username: string
  password: string
}

interface IWeather{
  _id:number
  parameterId: string
  stationId: number
  timeCreated: number
  timeObserved: number
  value: number
}

//window.sessionStorage.setItem("loggedIn?", "false");

let baseurl = "https://shoppersizerrest.azurewebsites.net/api/LiveNumber/1"
let limitUrl = "https://shoppersizerrest.azurewebsites.net/api/LimitNumber/1"
let dataSetUrl = "https://shoppersizerrest.azurewebsites.net/api/datasets/date"
let userUrl = "https://shoppersizerrest.azurewebsites.net/api/users/1"
let hoursUrl = "https://shoppersizerrest.azurewebsites.net/api/storehours"
let publicUrl = "https://shoppersizerrest.azurewebsites.net/api/publicornot"
let weatherUrl = "https://dmigw.govcloud.dk/metObs/v1/observation?latest=&parameterId=temp_dry&stationId=06156&api-key=155e78ec-dd81-4ab0-a4fc-7eef04cbe935"

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
    publicStatus: false,
    username: "",
    password: "",
    loggedIn: sessionStorage.getItem("loggedIn?"),
    temp: 0,

    options: {
      chart: [{
        id: 'vuechart',
        zoom: {
          enabled: false
        }
      }, {
        height: 350,
        type: 'line',
      }],
      stroke: {
        width: [0, 3]
      },
      /* fill: [
        {colors: ['#F44336', '#E91E63', '#9C27B0']},
        {colors: ['#F44336', '#E91E63', '#9C27B0']}
      ], */

      plotOptions: {
        bar: {
            //distributed: true
        }
      },
      
      xaxis: {
        categories: [],
        //tickPlacement: 'on'
      }
    },

    series: [{
      name: 'Antal kunder',
      type: 'column',
      data: [20,30,40,50]
    },{
      name: 'Grænseværdi',
      type: 'line',
      data: [0]
    }],



  },
  methods: {
    getLiveNumber() {
      axios.get<ILiveNumber>(baseurl)
        .then((response: AxiosResponse<ILiveNumber>) => {
          this.liveNumber = response.data.number
          this.getRemainingValue()
          //console.log(response.data)
          //console.log(sessionStorage.getItem("loggedIn?"))
          ////console.log(this.loggedIn)
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
          //console.log(error.message)
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
          ln.value = ""
          this.getLimitNumber()
        })
        .catch((error: AxiosError) => {
          console.log(error.message)
        })
    },
    changeColorMaxValue() {
      if (this.liveNumber >= (this.maxvalue / 100) * 50 && this.liveNumber <= (this.maxvalue / 100) * 75) {
        this.valueColor = "orange"
        //console.log(this.colors)
      } else if (this.liveNumber >= (this.maxvalue / 100) * 75) {
        this.valueColor = "red"
        //console.log(this.colors)
      } else {
        this.valueColor = "green"
      }
    },
    keepUpdating() {
      setInterval(this.getLiveNumber, 2000)
      setInterval(this.generateYaxisData, 2000)
      setInterval(this.changeColorMaxValue, 100)
      //setInterval(this.changePublicStatus, 1000)
      setInterval(this.getWeather,600000)
    },
    generateXaxisData() {
      this.options.xaxis.categories.length = 0
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
          let result2: number[] = []      
          
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

              if(hour == index){
                countArray[hour] = (element.count)
                
              }
            }); 
            result2.push(this.maxvalue)         
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
          },{
            data: result2
          }]
        })
        .catch((error: AxiosError) => {
          console.log(error.message)
        })

      

    },
    saveUsername(){
      let ln: HTMLInputElement = <HTMLInputElement>document.getElementById("valueInput4")
      axios.put<ILimitNumber>(userUrl, { id: 1, username: ln.value })
        .then((response: AxiosResponse<ILimitNumber>) => {
          console.log("changed username successfully")
          ln.value = ""
        })
        .catch((error: AxiosError) => {
          console.log(error.message)
        })
    },
    savePassword(){
      let ln: HTMLInputElement = <HTMLInputElement>document.getElementById("valueInput5")
      axios.put<ILimitNumber>(userUrl, { id: 1, password: ln.value })
        .then((response: AxiosResponse<ILimitNumber>) => {
          console.log("changed password successfully")
          ln.value = ""
        })
        .catch((error: AxiosError) => {
          console.log(error.message)
        })
    },
    saveOpenHour(){
      let ln: HTMLInputElement = <HTMLInputElement>document.getElementById("valueInput2")
      axios.put<ILimitNumber>(hoursUrl+"/open/"+ln.value)
        .then((response: AxiosResponse<ILimitNumber>) => {
          console.log("changed opening hour successfully")
          ln.value = ""
          this.getHours()
        })
        .catch((error: AxiosError) => {
          console.log(error.message)
        })
    },
    saveCloseHour(){
      let ln: HTMLInputElement = <HTMLInputElement>document.getElementById("valueInput3")
      axios.put<ILimitNumber>(hoursUrl+"/close/"+ln.value)
        .then((response: AxiosResponse<ILimitNumber>) => {
          console.log("changed closing hour successfully")
          ln.value = ""
          this.getHours()
        })
        .catch((error: AxiosError) => {
          console.log(error.message)
        })
    },
    changePublicStatus(){
      axios.put(publicUrl, this.publicStatus, {headers: {"Content-Type": "application/json"}})
        .then((response: AxiosResponse<Boolean>) => {
          console.log("changed public status successfully")
          this.getPublicStatus()
        })
        .catch((error: AxiosError) => {
          console.log(error.message)
          console.log()
        })
        console.log(this.publicStatus)
    },
    getPublicStatus(){
      axios.get<boolean>(publicUrl)
        .then((response: AxiosResponse<boolean>) => {
          this.publicStatus = response.data;
          console.log("public status is: " + response.data)
        })
        .catch((error: AxiosError) => {
          console.log(error.message)
        })
    },
    getHours(){
      axios.get<IStoreHours>(hoursUrl)
        .then((response: AxiosResponse<IStoreHours>) => {
          this.openingHour = response.data.openingHour;
          this.closingHour = response.data.closingHour;
          console.log("gotten openinghour : " + this.openingHour)
          console.log("gotten closinghour : " + this.closingHour)
          this.generateXaxisData()
        })
        .catch((error: AxiosError) => {
          console.log(error.message)
        })
    },
    login(){
      axios.get<IUser>(userUrl)
        .then((response: AxiosResponse<IUser>) => {
          if (this.username == response.data.username && this.password == response.data.password){
            this.loggedIn = true;
            window.sessionStorage.setItem("loggedIn?", "true");
            this.username = "";
            window.location.replace("/chartview.htm")
          }
          this.password = "";
        })
        .catch((error: AxiosError) => {
          console.log(error.message)
        })
    },
    loginPopup() {
      
      let display = document.getElementById("myForm")
      
      if(display.style.display == "none" || display.style.display == "") {
        display.style.display = "block"
      } else {
        display.style.display = "none"
      }

    },
    getWeather(){
      
      axios.get<IWeather[]>(weatherUrl)
      .then((response: AxiosResponse<IWeather[]>) => {
        this.temp=response.data[0].value
        console.log(this.temp)
        
      })
    },
  },
  created() {
    this.getLiveNumber()
    this.getLimitNumber()
    this.generateYaxisData()
    this.getHours()
    this.getPublicStatus()
    this.getWeather()
  },
  mounted() {
    this.keepUpdating()
  },

})

/* CHART VIEW PAGE */
