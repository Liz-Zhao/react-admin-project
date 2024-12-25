class ApiFeature {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
  
    filter() {
      const queryObj = { ...this.queryString };
      const excludedFields = ["page", "sort", "limit", "fields"];
      // remove excludedFields from queryObj
      excludedFields.forEach((el) => delete queryObj[el]);
  
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex|options)\b/g, (match) => `$${match}`);
      // console.log(queryStr);
  
      this.query.find(JSON.parse(queryStr));
  
      return this;
    }
  
    sort() {
      if (this.queryString.sort) {
        let querySort = this.queryString.sort.split(",").join(" ");
        this.query.sort(querySort);
      } else {
        this.query.sort({ createdAt: -1 });
      }
      return this;
    }
  
    limitFields() {
      if (this.queryString.fields) {
        let queryField = this.queryString.fields.split(",").join(" ");
        this.query.select(queryField);
      } else {
        this.query.select("-__v");
      }
      return this;
    }
  
    pagination() {
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 10;
      const skip = (page - 1) * limit;
  
      this.query.skip(skip).limit(limit);
      return this;
    }
  }

module.exports=  ApiFeature;