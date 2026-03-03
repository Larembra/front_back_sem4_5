const express = require('express')
const { nanoid } = require('nanoid')
const cors = require('cors')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const app = express()
const port = 3000

app.use(cors({ origin: 'http://localhost:3001' }))
app.use(express.json())

app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`)
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            console.log('Body:', req.body)
        }
    })
    next()
})

let products = [
    {
        id: nanoid(6),
        name: 'AI Server',
        category: 'GPU',
        description: 'эконом',
        price: 999,
        stock: 3
    },
    {
        id: nanoid(6),
        name: 'AI Server',
        category: 'GPU',
        description: 'дорогой',
        price: 9999999,
        stock: 2
    },
    {
        id: nanoid(6),
        name: 'a',
        category: 'b',
        description: 'c',
        price: 4,
        stock: 5
    },
    {
        id: nanoid(6),
        name: 'd',
        category: 'e',
        description: 'f',
        price: 4,
        stock: 5
    },
    {
        id: nanoid(6),
        name: 'g',
        category: 'h',
        description: 'i',
        price: 4,
        stock: 5
    },
    {
        id: nanoid(6),
        name: 'j',
        category: 'k',
        description: 'l',
        price: 4,
        stock: 5
    },
    {
        id: nanoid(6),
        name: 'o',
        category: 'l',
        description: 'm',
        price: 4,
        stock: 5
    },
    {
        id: nanoid(6),
        name: 'o',
        category: 'p',
        description: 'q',
        price: 4,
        stock: 5
    },
    {
        id: nanoid(6),
        name: 'r',
        category: 's',
        description: 't',
        price: 4,
        stock: 5
    },
    {
        id: nanoid(6),
        name: 'y',
        category: 'v',
        description: 'w',
        price: 4,
        stock: 5
    }
]

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Tech Store API — Servers for AI',
            version: '1.0.0',
            description: 'API для магазина серверов для ИИ (каталог, создание, редактирование, удаление)',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Локальный сервер',
            },
        ],
    },
    apis: ['./server.js'],
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - description
 *         - price
 *         - stock
 *       properties:
 *         id:
 *           type: string
 *           description: Уникальный ID товара
 *         name:
 *           type: string
 *           description: Название сервера/конфигурации
 *         category:
 *           type: string
 *           description: Категория (например, GPU-серверы)
 *         description:
 *           type: string
 *           description: Описание конфигурации
 *         price:
 *           type: number
 *           description: Цена (₽) за сервер
 *         stock:
 *           type: integer
 *           description: Количество в наличии
 *       example:
 *         id: "abc123"
 *         name: "AI Server H100 x8"
 *         category: "GPU-серверы"
 *         description: "8× NVIDIA H100 80GB, 2× Intel Xeon, 1TB RAM, 8TB NVMe"
 *         price: 7999990
 *         stock: 2
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Возвращает список всех товаров (серверов)
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
app.get('/api/products', (req, res) => {
    res.json(products)
})

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Возвращает товар по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Товар найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 */
app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id)
    if (!product) return res.status(404).json({ error: 'Not found' })
    res.json(product)
})

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создает новый товар (сервер)
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - description
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Товар создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Ошибка в теле запроса
 */
app.post('/api/products', (req, res) => {
    const { name, category, description, price, stock } = req.body || {}

    if (!name || !category || !description || price === undefined || stock === undefined) {
        return res.status(400).json({ error: 'Required fields are missing' })
    }

    const product = {
        id: nanoid(6),
        name: String(name).trim(),
        category: String(category).trim(),
        description: String(description).trim(),
        price: Number(price),
        stock: Number(stock),
    }

    products.push(product)
    res.status(201).json(product)
})

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Частично обновляет товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Обновленный товар
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Нет данных для обновления
 *       404:
 *         description: Товар не найден
 */
app.patch('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id)
    if (!product) return res.status(404).json({ error: 'Not found' })

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Nothing to update' })
    }

    const { name, category, description, price, stock } = req.body

    if (name !== undefined) product.name = String(name).trim()
    if (category !== undefined) product.category = String(category).trim()
    if (description !== undefined) product.description = String(description).trim()
    if (price !== undefined) product.price = Number(price)
    if (stock !== undefined) product.stock = Number(stock)

    res.json(product)
})

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удаляет товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     responses:
 *       204:
 *         description: Товар удален
 *       404:
 *         description: Товар не найден
 */
app.delete('/api/products/:id', (req, res) => {
    const id = req.params.id
    const exists = products.some(p => p.id === id)
    if (!exists) return res.status(404).json({ error: 'Not found' })
    products = products.filter(p => p.id !== id)
    res.status(204).send()
})

app.use((req, res) => {
    res.status(404).json({ error: 'Not found' })
})

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err)
    res.status(500).json({ error: 'Internal server error' })
})

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`)
    console.log(`Swagger UI доступен по адресу http://localhost:${port}/api-docs`)
})