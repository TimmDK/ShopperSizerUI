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
    el: "#app",
    data:{
        LiveNumber: 0,
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

