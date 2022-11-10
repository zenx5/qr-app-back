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

router.get('/menus', await getAll(Menu, {include: [Client, Product, Qrcode]}))
router.get('/menus/:id', await getUnique(Menu, {include: [Client, Product, Qrcode]}))
router.get('/m/:token', async (req, res)=>{
    const options = {
        where:{
            token: req.params.token
        },
        include:[
            Client,
            Product,
            Qrcode
        ]
    }
    const result = await Menu.findAll( options )
    if( result.length > 0 ){
        res.json({message:`Select Record with token=${req.params.token}`, data:result, error: false})
    }else{
        res.json({message:`Not Record Selected`, data:[], error: true})
    }
})
router.post('/menus', await create(Menu))
router.put('/menus/:id', await update(Menu))
router.delete('/menus/:id', await destroy(Menu))

router.get('/products', await getAll(Product, { include: Menu}))
router.get('/products/:id/menu', await getUnique(Product, {include: Menu}))
router.post('/products', await create(Product))
router.put('/products/:id', await update(Product))
router.delete('/products/:id', await destroy(Product))

router.get('/fields/:name/', async (req, res) => {
    try{
        const model = database.model(req.params.name)
        const schema = await model.getAttributes()
        const fields = Object.keys( schema ).filter( field => !['createdAt', 'updatedAt'].includes(field))
        res.json({message:`Schema of ${req.params.name}`, data: fields, error: false})
    }catch(error){
        res.json({message:`Schema not found for ${req.params.name}`, data: error.message, error: true})
    }    
})
router.get('/schema/:name', async (req, res) => {
    try{
        const model = database.model(req.params.name)
        const schema = await model.getAttributes()
        res.json({message:`Schema of ${req.params.name}`, data: {...schema, createdAt:undefined, updatedAt:undefined }, error: false})
    }catch(error){
        res.json({message:`Schema not found for ${req.params.name}`, data: error.message, error: true})
    }    
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use( morgan('dev') );
app.use( cors() )
app.use( router )

app.listen(5000, ()=>console.log('init'))



