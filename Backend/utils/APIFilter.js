
class APIFilter {
    constructor(query, queryStr){
        this.query = query
        this.queryStr = queryStr
        this.length = 0
    }


     search(){
        
        const keyWord = this.queryStr.name
        ? {
            name : {
                $regex : this.queryStr.name,
                $options : "i"
            }
        } : {}

        this.query = this.query.find({...keyWord})
        return this
    }



    filter(){
        const copyQueryStr = {...this.queryStr}

        const itemsToRemove = ['name','page']
        itemsToRemove.forEach((item)=>delete copyQueryStr[item])

        let queryStr = JSON.stringify(copyQueryStr)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr))          

        return this
    }


    pagentation(itemsPerPage){
        const page = this.queryStr.page || 1
        const next = itemsPerPage * (page- 1 )
        let items = this.query.limit(itemsPerPage).skip(next)
        return items
    }

}

export default APIFilter