import React, { useEffect, useState } from 'react';

const ProductModal = ({ open, mode, initialProduct, onClose, onSubmit }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');

    useEffect(() => {
        if (open && initialProduct) {
            setName(initialProduct.name || '');
            setCategory(initialProduct.category || '');
            setDescription(initialProduct.description || '');
            setPrice(initialProduct.price?.toString() || '');
            setStock(initialProduct.stock?.toString() || '');
        } else if (open) {
            setName('');
            setCategory('');
            setDescription('');
            setPrice('');
            setStock('');
        }
    }, [open, initialProduct]);

    if (!open) return null;

    const handleSubmit = e => {
        e.preventDefault();

        if (!name.trim() || !category.trim() || !description.trim() || !price || !stock) {
            alert('Заполните все поля');
            return;
        }

        onSubmit({
            id: initialProduct?.id,
            name: name.trim(),
            category: category.trim(),
            description: description.trim(),
            price: Number(price),
            stock: Number(stock)
        });
    };

    return (
        <div className="backdrop" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal__header">
                    <div className="modal__title">
                        {mode === 'edit' ? 'Редактировать сервер' : 'Добавить сервер в каталог'}
                    </div>
                    <button className="iconBtn" onClick={onClose}>✕</button>
                </div>

                <form className="form" onSubmit={handleSubmit}>
                    <label className="label">
                        Название сервера
                        <input
                            className="input"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="AI Server"
                            autoFocus
                        />
                    </label>

                    <label className="label">
                        Категория
                        <input
                            className="input"
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            placeholder="GPU"
                        />
                    </label>

                    <label className="label">
                        Описание
                        <textarea
                            className="input"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="сеть"
                            rows="3"
                        />
                    </label>

                    <label className="label">
                        Цена за сервер (руб)
                        <input
                            className="input"
                            type="number"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            placeholder="99999"
                            min="0"
                        />
                    </label>

                    <label className="label">
                        Серверов в наличии
                        <input
                            className="input"
                            type="number"
                            value={stock}
                            onChange={e => setStock(e.target.value)}
                            placeholder="5"
                            min="0"
                        />
                    </label>

                    <div className="modal__footer">
                        <button type="button" className="btn" onClick={onClose}>
                            Отмена
                        </button>
                        <button className="btn btn--primary" type="submit">
                            {mode === 'edit' ? 'Сохранить' : 'Создать'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;