import React, { useState, useEffect } from 'react';
import './ProductsPage.scss';
import ProductsList from '../../components/ProductsList';
import ProductModal from '../../components/ProductModal';
import { api } from '../../api';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await api.getProducts();
            setProducts(data);
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            alert('Не удалось загрузить конфигурации серверов');
        } finally {
            setLoading(false);
        }
    };

    const openCreate = () => {
        setModalMode('create');
        setEditingProduct(null);
        setModalOpen(true);
    };

    const openEdit = product => {
        setModalMode('edit');
        setEditingProduct(product);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingProduct(null);
    };

    const handleDelete = async id => {
        if (!window.confirm('Удалить сервер из каталога?')) return;

        try {
            await api.deleteProduct(id);
            setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            console.error('Ошибка удаления:', error);
            alert('Не удалось удалить сервер');
        }
    };

    const handleSubmit = async productData => {
        try {
            if (modalMode === 'create') {
                const newProduct = await api.createProduct(productData);
                setProducts([...products, newProduct]);
            } else {
                const updatedProduct = await api.updateProduct(productData.id, productData);
                setProducts(products.map(p => (p.id === productData.id ? updatedProduct : p)));
            }
            closeModal();
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            alert('Не удалось сохранить конфигурацию сервера');
        }
    };

    return (
        <div className="page">
            <header className="header">
                <div className="header__inner">
                    <div className="brand">AI Server Store</div>
                    <div className="header__right">недорогие</div>
                </div>
            </header>

            <main className="main">
                <div className="container">
                    <div className="toolbar">
                        <h1 className="title">Серверы для ИИ ({products.length})</h1>
                        <button className="btn btn--primary" onClick={openCreate}>
                            + Добавить сервер
                        </button>
                    </div>

                    {loading ? (
                        <div className="empty">Загрузка конфигураций...</div>
                    ) : (
                        <ProductsList products={products} onEdit={openEdit} onDelete={handleDelete} />
                    )}
                </div>
            </main>

            <footer className="footer">
                <div className="footer__inner">
                    © {new Date().getFullYear()} AI Server
                </div>
            </footer>

            <ProductModal
                open={modalOpen}
                mode={modalMode}
                initialProduct={editingProduct}
                onClose={closeModal}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default ProductsPage;