import express from 'express'
import morgan from 'morgan';
import cors from 'cors'
import bodyParser from 'body-parser'
import { database } from './database/database.js';
import { Qrcode, Menu, Product, Client } from './database/Models.js';
import { 
    getAll,
    getUnique,
    create,
    update,
    destroy
 } from './methods.js';


const app = express();
const router = express.Router();



router.get('/reset', async (req, res)=>{
    await database.sync({force:true})
    res.json({message: 'database reset'})
})

router.get('/', (req, res)=>{
    res.json({message:'API Running', data:[
        {
            name: 'qrcodes',
            methods: ['get', 'post', 'put', 'delete']
        }
    ], error: false})
})

router.get('/clients', await getAll(Client, {include: Menu}))
router.get('/clients/:id', await getUnique(Client, {include: Menu}))
router.post('/clients', await create(Client))
router.put('/clients/:id', await update(Client))
router.delete('/clients/:id', await destroy(Client))

router.get('/qrcodes', await getAll(Qrcode))
router.get('/qrcodes/:id', await getUnique(Qrcode))
router.post('/qrcodes', await create(Qrcode))
router.put('/qrcodes/:id', await update(Qrcode))
router.delete('/qrcodes/:id', await destroy(Qrcode))

router.get('/menus', await getAll(Menu, {include: [Product, Qrcode]}))
router.get('/menus/:id', await getUnique(Menu, {include: [Product, Qrcode]}))
router.post('/menus', await create(Menu))
router.put('/menus/:id', await update(Menu))
router.delete('/menus/:id', await destroy(Menu))

router.get('/products', await getAll(Product))
router.get('/products/menu', await getAll(Product, { include: Menu}))
router.get('/products/:id', await getUnique(Product))
router.get('/products/:id/menu', await getUnique(Product, {include: Menu}))
router.post('/products', await create(Product))
router.put('/products/:id', await update(Product))
router.delete('/products/:id', await destroy(Product))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use( morgan('dev') );
app.use( cors() )
app.use( router )

app.listen(5000, ()=>console.log('init'))



