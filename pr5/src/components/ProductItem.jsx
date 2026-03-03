import React from 'react';

const ProductItem = ({ product, onEdit, onDelete }) => {
    return (
        <div className="productRow">
            <div className="productMain">
                <div className="productId">#{product.id?.slice(0, 4)}</div>
                <div className="productName">{product.name}</div>
                <div className="productCategory">{product.category}</div>
                <div className="productDescription">{product.description}</div>
                <div className="productPrice">{product.price.toLocaleString('ru-RU')} руб/сервер</div>
                <div className="productStock">В наличии в датацентре: {product.stock}</div>
            </div>
            <div className="productActions">
                <button className="btn" onClick={() => onEdit(product)}>
                    Редактировать сервер
                </button>
                <button className="btn btn--danger" onClick={() => onDelete(product.id)}>
                    Удалить из каталога
                </button>
            </div>
        </div>
    );
};

export default ProductItem;