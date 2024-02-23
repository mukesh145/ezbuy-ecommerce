import Product from "../models/productSchema.js"
import ErrorHandler from "../utils/errorHandler.js"
import APIFilter from "../utils/APIFilter.js"


//get all products
export const getProducts = async (req,res,next)=>{
    const resPerPage = 4;
    const apiFilters = new APIFilter(Product, req.query).search().filter();
  
    let products = await apiFilters.query;
    let filteredProductsCount = products.length;
  
    apiFilters.pagentation(resPerPage);
    products = await apiFilters.query.clone();
  
    res.status(200).json({
      resPerPage,
      filteredProductsCount,
      products,
    });
}




//get product by id
export const getProductDetails = async (req,res,next)=>{
    const product = await Product.findById(req.params.id)

    if(!product){
        return next(new ErrorHandler("Product not found", 404))
    }

    res.status(200).json({
        product
    })
}


//create products -- ADMIN route
export const createNewProduct = async (req,res,next)=>{
    const product = await Product.create(req.body)

    res.status(200).json({
        product
    })
}

//update products -- ADMIN route
export const updateProduct = async (req,res,next)=>{
    
    const product = await Product.findByIdAndUpdate(req.params.id, req.body , {new : true})

    if(!product){
        return next(new ErrorHandler("Product not found", 404))
    }

    res.status(200).json({
        product
    })
}


//delete products ---ADMIN route
export const deleteProduct = async (req,res,next)=>{
    const product = await Product.findById(req.params.id)

    if(!product){
        return next(new ErrorHandler("Product not found", 404))
    }

    await product.deleteOne()
    

    res.status(200).json({
        success : "Deleted"
    })
}


//create product review
export const createProductReview = async (req, res, next) => {
    const { rating, comment, productId } = req.body;
  
    const review = {
      user: req?.user?._id,
      rating: Number(rating),
      comment,
    };
  
    const product = await Product.findById(productId);
  
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
  
    const isReviewed = product?.reviews?.find(
      (r) => r.user.toString() === req?.user?._id.toString()
    );
  
    if (isReviewed) {
      product.reviews.forEach((review) => {
        if (review?.user?.toString() === req?.user?._id.toString()) {
          review.comment = comment;
          review.rating = rating;
        }
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }
  
    product.ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;
  
    await product.save({ validateBeforeSave: false });
  
    res.status(200).json({
      success: true,
    });
  }
  
  // Get product reviews   =>  /api/v1/reviews
  export const getProductReviews = async (req, res, next) => {
    const product = await Product.findById(req.query.id);
  
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
  
    res.status(200).json({
      reviews: product.reviews,
    });
  }
  
  // Delete product review   =>  /api/v1/admin/reviews
  export const deleteReview = async (req, res, next) => {
    let product = await Product.findById(req.query.productId);
  
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
  
    const reviews = product?.reviews?.filter(
      (review) => review._id.toString() !== req?.query?.id.toString()
    );
  
    const numOfReviews = reviews.length;
  
    const ratings =
      numOfReviews === 0
        ? 0
        : product.reviews.reduce((acc, item) => item.rating + acc, 0) /
          numOfReviews;
  
    product = await Product.findByIdAndUpdate(
      req.query.productId,
      { reviews, numOfReviews, ratings },
      { new: true }
    );
  
    res.status(200).json({
      success: true,
      product,
    });
  }