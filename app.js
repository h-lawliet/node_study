// 해결해야 될거
// 1. post 요청 받고 현재페이지에서 alert 보내기
// 2. post 요청에서 괄호 내 url은 무슨 의미?
// 3. post 요청 이해못함.
// ajax : 새로고침 없이 서버에 요청 보낼 수 있음

const express = require('express')
const app = express()

app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const { MongoClient, ObjectId } = require('mongodb')
let db
const url = 'mongodb+srv://whoish5252:hkrJjvTjjdQpeFxH@cluster0.wgharzd.mongodb.net/?retryWrites=true&w=majority'
new MongoClient(url).connect().then((client) => {
  console.log('DB 연결됨');
  db = client.db('forum')
  app.listen(3000, () => {
    console.log('port 3000 open')
  })
}).catch((err) => {
  console.log(err)
})

app.get('/', async (req, res) => {
  let result = await db.collection('post').find().toArray();
  res.render('main.ejs', {post : result})
})

app.post('/', async (req, res) => {
  try {
    if (req.body.title == '') {
      res.send("내용을 입력하세요")
    } else {
      await db.collection('post').insertOne({title : req.body.title, content : req.body.content})
      res.redirect('/')
    }
  } catch(error) {
    console.log(error)
  }
})

app.get('/write', (req, res) => {
  res.render('write.ejs')
})

app.get('/list/:id', async (req, res) => {
  try {
    let id = req.params.id
    let result = await db.collection('post').findOne({_id : new ObjectId(id)})
    res.render('text.ejs', {text : result})
  } catch (err) {
    console.log(err)
    res.status(500).send('똑바로 입력해라')
  }
})

app.get('/edit/:id', async (req, res) => {
  try {
    let id = req.params.id
    let result = await db.collection('post').findOne({_id : new ObjectId(id)})
    res.render('edit.ejs', {edit : result})
  } catch (err) {
    console.log(err)
    res.status(500).send('똑바로 입력해라')
  }
})

app.post('/edit', async (req, res) => {
  try {
    if (req.body.title == '') {
      res.send("내용을 입력하세요")
    } else {
      await db.collection('post').updateOne({_id : new ObjectId(req.body.id)}, {$set : {title : req.body.title, content : req.body.content}})
      res.redirect('/')
    }
  } catch(error) {
    console.log(error)
  }
})

app.post('/delete', async (req, res) => {
  try {
    console.log(req.body)
    await db.collection('post').deleteOne({_id : new ObjectId(req.query.id)})
    res.redirect('/')
  } catch(error) {
    console.log(error)
  }
})