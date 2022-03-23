- npm init -y & .gitignore (isi node_modules)
- npm i sequelize pg express ejs
- npm i --save-dev sequelize-cli
- npx sequelize init
- setup config
- npx sequelize db:create
- (Model is Singular)
- npx sequelize-cli model:generate --name User --attributes email:string,password:string,role:boolean
- npx sequelize-cli model:generate --name Order --attributes shippingAddress:text,orderDate:date,ordernum:string,status:Boolean,quantity:integer,totalPrice:float
- npx sequelize-cli model:generate --name Product --attributes name:string,stock:integer,price:float
- npx sequelize-cli model:generate --name ProductDetail --attributes description:text,category:string,foodPairing:string
- Tambah allowNull:false ke semua

(Add Column FK) Template di docs create table
- npx sequelize-cli migration:generate --name add-ProductId-to-ProductDetails
- npx sequelize-cli migration:generate --name add-UserId-to-Orders
- npx sequelize-cli migration:generate --name add-ProductId-to-Orders
- User.hasMany(models.Order)
- Order.belongsTo(models.User)
- Order.belongsTo(models.Product)
- Product.hasOne(models.Order)
- Product.hasOne(models.ProductDetail)
- ProductDetail.belongsTo(models.Product)

- dalam file migration nambah Key di dalam queryInterface Up: Nama Table, Nama kolom, objek lsg(Option) 
- Optionnya ada type data, references with model dan key, onUpdate, onDelete

- npx sequelize-cli db:migrate

(Seeding) 
- npx sequelize-cli seed:generate --name seed-master
- fs read json
- loop dan masukin createdAt dan updatedAt
- DELETE data.ID nya
- return bulk insert

- npx sequelize-cli db:seed:all
- (Di controller require modelnya dengan target index)

(Kalau tambah kolom)
- Migration Generate isi dengan fungsi kolom


(Setup Express & MVC)
- mkdir views controllers
- touch app.js
- Masukkan app set 'view engine', 'ejs'
- Masukkan app use express.urlencoded {extended: true}
  

  Hitung dll pake fn disequelize


  Validasi Min argsnya harus didalam array misal min [0]

  Algo update stock :
  - findByPk then return Book.update(lsg kurang stock, where id = id)
  - then redirect

  helper is a function and export that function(currency pake tolocalestring id id)

  cara pake Ilike`%${search}%`}