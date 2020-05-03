import axios, {
    AxiosResponse,
    AxiosError
} from "../../node_modules/axios/index";

interface IRecord {
    id : number,
    title : string
    artist : string
    releaseYear : number
}

new Vue({
    el: "#app", 
    data: {
        baseUrl: "https://restdrrecordstimm.azurewebsites.net/api/records",
        records : [],
        errors : [],
        responseMsg: null,
        search : "",
        editId : null,
        editMode : false,
        addPressed : false,
        addForm: {
            title : null,
            artist : null,
            releaseYear : null
        },
        editForm: {
            title : null,
            artist : null,
            releaseYear : null
        }
    },

    created()
    {
        console.log("CREATED")
        this.getAll()
    },

    methods: {

         bookSearch : function()
        {
            if(this.search != "" && this.search != null)
            {
                axios.get<IRecord[]>(this.baseUrl+ "?title="+ this.search) 
                .then((response : AxiosResponse<IRecord[]>) =>{
                    console.log(response.data)
                    this.records = response.data
                })
                .catch((error : AxiosError) => {
                    this.errors = error
                })
            }
        },

        getAll: function()
        {
            axios.get<IRecord[]>(this.baseUrl)
            .then((response : AxiosResponse<IRecord[]>) => {
                console.log(response.data)
                this.records = response.data
            })
            .catch((error : AxiosError) => {
                this.errors = error
            })
        },

        addRecord: function() 
        {
            console.log(this.addForm)
            axios.post(this.baseUrl, this.addForm)
            .then((response : AxiosResponse<IRecord>) => {
                console.log("Added")
                this.getAll()

            })
            .catch((error : AxiosError) => {
                this.errors = error
            })

        },

        editSaveRecord: function(id : number)
        {
            console.log("Rettet " + id)
            console.log(this.editForm)
            axios.put<void>(this.baseUrl + "/" + id, this.editForm)
            .then((response : AxiosResponse) =>{
                console.log("Rettet " + id)
                this.editId = null
            })
            .catch((error : AxiosError) => {
                this.errors = error
            })

        },

        deleteRecord: function(id : number)
        {
            if(confirm("Er du sikker på at du vil slette record " + id))
            {
                console.log(id)
                axios.delete<void>(this.baseUrl + "/" + id)
                .then((response : AxiosResponse) =>{
                    this.getAll()
                })
                .catch((error : AxiosError) => {
                    this.errors = error
                })
            }
        },
    }
})