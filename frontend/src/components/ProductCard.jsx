import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <div className="product-card-body">
        <h3 className="product-card-name">{product.name}</h3>
        <p className="product-card-desc">
          {product.description.length > 80
            ? product.description.slice(0, 80) + "..."
            : product.description}
        </p>
      </div>
      <div className="product-card-footer">
        <span className="product-card-price">₹{product.price.toLocaleString("en-IN")}</span>
        <span className="product-card-view">View →</span>
      </div>
    </div>
  );
}

export default ProductCard;
