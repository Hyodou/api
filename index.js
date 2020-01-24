const mysql = require('mysql');
const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyparser = require('body-parser');
const hbs = require('hbs');
const Handlebars = require('express-handlebars');
var app = express();
//Configuring express server
app.set('views',path.join(__dirname,'views'));
//set view engine
app.set('view engine', 'hbs');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use('/assets',express.static(__dirname + '/public'));
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
//database
const http = require('http');

const hostname = 'remotemysql.com';
var mysqlConnection = mysql.createConnection({
  host: 'remotemysql.com',
  user: 'lLQ3ASPdO3',
  password: '3IdvnZQuK8',
  database: 'lLQ3ASPdO3',
  multipleStatements: true
  });
mysqlConnection.connect((err)=> {
  if(!err)
  console.log('Connection Established Successfully');
  else
  console.log('Connection Failed!'+ JSON.stringify(err,undefined,2));
  });
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Listening on port ${port}..`));

//user
app.get('/user' , (req, res) => {
  let sql = "SELECT * FROM user";
  let query = mysqlConnection.query(sql, (err, results) => {
    if(err) throw err;
    res.render('user_view',{
      results: results
    });
  });
});
  
app.post('/user/save',(req, res) => {
  let data = {cedula: req.body.cedula, nombre: req.body.nombre, apellido: req.body.apellido, email: req.body.email, telefono: req.body.telefono};
  let sql = "INSERT INTO user SET ?";
  let query = mysqlConnection.query(sql, data,(err, results) => {
    if(err) throw err;
    res.redirect('/user');
  });
});

app.post('/user/update',(req, res) => {
  let sql = "UPDATE user SET nombre='"+req.body.nombre+"', apellido='"+req.body.apellido+"', email='"+req.body.email+"', telefono='"+req.body.telefono+"' WHERE cedula="+req.body.cedula;
  let query = mysqlConnection.query(sql, (err, results) => {
    if(err) throw err;
    res.redirect('/user');
  });
});


//administrador  
app.get('/administradores' , (req, res) => {
  let sql = "select idadministrador, cedula, nombre, apellido, email, telefono, contraseñaadministrador from user u, administrador a where u.cedula = a.userid";
  let query = mysqlConnection.query(sql, (err, results) => {
    if(err) throw err;
    res.render('administrador_view',{
      results: results
    });
  });
});

app.post('/administradores/save',(req, res) => {
  let data = {cedula: req.body.cedula, nombre: req.body.nombre, apellido: req.body.apellido, email: req.body.email, telefono: req.body.telefono};
  let sql = "INSERT INTO user SET ?";
  let query = mysqlConnection.query(sql, data,(err, results) => {
    if(err) throw err;
    let data2 = {userid: req.body.cedula, contraseñaadministrador: req.body.contraseñaadministrador};
    let sql2 = "INSERT INTO administrador SET ?";
    let q2 = mysqlConnection.query(sql2, data2, (err2, results)=>{
      if(err2) throw err2;
    });
    res.redirect('/administradores');
  });
}); 

app.post('/administradores/update',(req, res) => {
  let sql2 = "UPDATE user SET nombre='"+req.body.nombre+"', apellido='"+req.body.apellido+"', email='"+req.body.email+"', telefono='"+req.body.telefono+"' WHERE cedula="+req.body.cedula;
  let query = mysqlConnection.query(sql2, (err, results) => {
    if(err) throw err;
    let sql = "UPDATE administrador SET contraseñaadministrador='"+req.body.contraseñaadministrador+"' WHERE userid="+req.body.cedula;
    let query2 = mysqlConnection.query(sql, (err, results) =>{
      if(err) throw err;
    });
    res.redirect('/administradores');
  });
});


//cliente  
app.get('/clientes' , (req, res) => {
  let sql = "select idcliente, nombrestadoventa as estado, cedula, nombre, apellido, email, telefono, direccion from registro r, estadoventa e, user u, cliente a where r.clienteid = a.userid and u.cedula = a.userid and r.estadoid = e.idestadoventa";
  let query = mysqlConnection.query(sql, (err, results) => {
    if(err) throw err;
    res.render('cliente_view',{
      results: results
    });
  });
});

app.post('/clientes/save',(req, res) => {
  let data = {cedula: req.body.cedula, nombre: req.body.nombre, apellido: req.body.apellido, email: req.body.email, telefono: req.body.telefono};
  let sql = "INSERT INTO user SET ?";
  let query = mysqlConnection.query(sql, data,(err, results) => {
    if(err) throw err;
    let data2 = {userid: req.body.cedula, direccion: req.body.direccion};
    let sql2 = "INSERT INTO cliente SET ?";
    let q2 = mysqlConnection.query(sql2, data2, (err2, results)=>{
      if(err2) throw err2;
    });
    res.redirect('/clientes');
  });
});


app.post('/clientes/update',(req, res) => {
  let sql2 = "UPDATE user SET nombre='"+req.body.nombre+"', apellido='"+req.body.apellido+"', email='"+req.body.email+"', telefono='"+req.body.telefono+"' WHERE cedula="+req.body.cedula;
  let query = mysqlConnection.query(sql2, (err, results) => {
    if(err) throw err;
    let sql = "UPDATE cliente SET direccion='"+req.body.direccion+"' WHERE userid="+req.body.cedula;
    let query2 = mysqlConnection.query(sql, (err, results) =>{
      if(err) throw err;
    });
    res.redirect('/clientes');
  });  
});



//vendedor
app.get('/vendedores' , (req, res) => {
  let sql = "select idvendedor, cedula, nombre, apellido, email, telefono, tipoid, nombretipovendedor, contraseñavendedor from user u, vendedor a, tipovendedor t where u.cedula = a.userid and a.tipoid = t.idtipovendedor";
  let query = mysqlConnection.query(sql, (err, results) => {
    if(err) throw err;
    res.render('vendedor_view',{
      results: results
    });
  });
});

app.post('/vendedores/save',(req, res) => {
  let data = {cedula: req.body.cedula, nombre: req.body.nombre, apellido: req.body.apellido, email: req.body.email, telefono: req.body.telefono};
  let sql = "INSERT INTO user SET ?";
  let query = mysqlConnection.query(sql, data,(err, results) => {
    if(err) throw err;
    let data2 = {userid: req.body.cedula, contraseñavendedor: req.body.contraseñavendedor};
    let sql2 = "INSERT INTO vendedor SET ?";
    let q2 = mysqlConnection.query(sql2, data2, (err2, results)=>{
      if(err2) throw err2;
    });
    res.redirect('/vendedores');
  });
});

app.post('/vendedores/update',(req, res) => {
  let sql2 = "UPDATE user SET nombre='"+req.body.nombre+"', apellido='"+req.body.apellido+"', email='"+req.body.email+"', telefono='"+req.body.telefono+"' WHERE cedula="+req.body.cedula;
  let query = mysqlConnection.query(sql2, (err, results) => {
    if(err) throw err;
    let sql = "UPDATE vendedor SET contraseñavendedor='"+req.body.contraseñavendedor+"', tipoid='"+req.body.tipoid+"' WHERE userid="+req.body.cedula;
    let query2 = mysqlConnection.query(sql, (err, results) =>{
      if(err) throw err;
    });
    res.redirect('/vendedores');
  });
});


//asesor  
app.get('/asesores' , (req, res) => {
  let sql = "select idasesor, cedula, nombre, apellido, email, telefono, contraseñaasesor from user u, asesor a where u.cedula = a.userid";
  let query = mysqlConnection.query(sql, (err, results) => {
    if(err) throw err;
    res.render('asesor_view',{
      results: results
    });
  });
});

app.post('/asesores/save',(req, res) => {
  let data = {cedula: req.body.cedula, nombre: req.body.nombre, apellido: req.body.apellido, email: req.body.email, telefono: req.body.telefono};
  let sql = "INSERT INTO user SET ?";
  let query = mysqlConnection.query(sql, data,(err, results) => {
    if(err) throw err;
    let data2 = {userid: req.body.cedula, contraseñaasesor: req.body.contraseñaasesor};
    let sql2 = "INSERT INTO asesor SET ?";
    let q2 = mysqlConnection.query(sql2, data2, (err2, results)=>{
      if(err2) throw err2;
    });
    res.redirect('/asesores');
  });
});

app.post('/asesores/update',(req, res) => {
  let sql2 = "UPDATE user SET nombre='"+req.body.nombre+"', apellido='"+req.body.apellido+"', email='"+req.body.email+"', telefono='"+req.body.telefono+"' WHERE cedula="+req.body.cedula;
  let query = mysqlConnection.query(sql2, (err, results) => {
    if(err) throw err;
    let sql = "UPDATE asesor SET contraseñaasesor='"+req.body.contraseñaasesor+"' WHERE userid="+req.body.cedula;
    let query2 = mysqlConnection.query(sql, (err, results) =>{
      if(err) throw err;
    });
    res.redirect('/asesores');
  }); 
});


//registro
app.get('/confirmaciones', (req, res) =>{
  let sql = "select id, userid, nombrestadoventa as estado, nombre, apellido, email, telefono, direccion from registro r, cliente c, user u, estadoventa e where r.clienteid = c.userid and c.userid = u.cedula and r.estadoid = e.idestadoventa and r.estadoid = 1";
  let query = mysqlConnection.query(sql, (err, results) =>{
    if(err) throw err;
    res.render('confirmacion_view', {
      results: results
    });
  });
});

app.post('/confirmaciones/update', (req, res) =>{
  let sql = "UPDATE registro SET  estadoid='"+req.body.estado+"' WHERE id="+req.body.id;
  let query = mysqlConnection.query(sql, (err, results) => {
    if(err) throw err;
    res.redirect('/confirmaciones');
  });
});

app.post('/aregistro/update', (req, res) =>{
  var user = req.body.asesorid;
  let sql = "UPDATE registro SET valor = '"+req.body.valor+"', estadoid='"+req.body.estado+"' WHERE id="+req.body.id;
  let query = mysqlConnection.query(sql, (err, results) => {
    if(err) throw err;
    res.redirect('/aregistro/'+user);
  });
});

app.get('/asignaciones' , (req, res) => {
  let sql = "select r.id as registroid, clienteid, userid, nombrestadoventa as estado, nombre, apellido, email, telefono, direccion from registro r, cliente c, user u, estadoventa e where r.clienteid = c.userid and c.userid = u.cedula and r.estadoid = e.idestadoventa and r.estadoid = 2";
  let query = mysqlConnection.query(sql, (err, results) => {
    if(err) throw err;
    let sql2 = "select idasesor, nombre as nombreasesor, apellido as apellidoasesor from asesor a, user u where a.userid = u.cedula";
    let query2 = mysqlConnection.query(sql2, (err, results2) =>{
      if(err) throw err;
        res.render('asignacion_view',{
          results: results, results2: results2
        });
    }); 
  });
});

app.get('/registro' , (req, res) => {
  let sql = "select id, userid, vendedorid, nombrestadoventa as estado, nombre, apellido, email, telefono, direccion from registro r, cliente c, user u, estadoventa e where r.clienteid = c.userid and c.userid = u.cedula and r.estadoid = e.idestadoventa";
  let query = mysqlConnection.query(sql, (err, results) =>{
    if(err) throw err;
    let sql2 = "select idvendedor, nombre as nombrevendedor, apellido as apellidovendedor from vendedor";
    let query2 = mysqlConnection.query(sql2, (err, results2) =>{
      res.render('registro_view', {
        results: results, results2: results2
      });
    });
  });
});

app.post('/asignaciones/save',(req, res) => {
  let data = {registroid: req.body.registroid, asesorid: req.body.asesorid};
  let sql = "INSERT INTO asignacion SET ?";
  let query = mysqlConnection.query(sql, data,(err, results) => {
    if(err) throw err;
  });
  let sql2 = "UPDATE registro SET estadoid='3' where id="+req.body.registroid;
  let query2 = mysqlConnection.query(sql2,(err,results)=>{
    if(err) throw err;
    res.redirect('/asignaciones');
  });
});

app.post('/registro/save',(req, res) => {
  let data = {clienteid: req.body.clienteid, vendedorid: req.body.vendedorid};
  let sql = "INSERT INTO registro SET ?";
  let query = mysqlConnection.query(sql, data,(err, results) => {
    if(err) throw err;
    res.redirect('/registro');
  });
});

app.post('/registro/update',(req, res) => {
  let sql = "UPDATE registro SET estadoid='"+req.body.estadoid+"' WHERE id="+req.body.id;
  let query = mysqlConnection.query(sql, (err, results) => {
    if(err) throw err;
    res.redirect('/registro');
  });
});

app.post('/registro/updatev',(req, res) => {
  let sql = "UPDATE registro SET valor='"+req.body.valor+"' WHERE id="+req.body.id;
  let query = mysqlConnection.query(sql, (err, results) => {
    if(err) throw err;
    res.redirect('/registro');
  });
});

app.post('/registro/updateall', (req, res) =>{
  let sql2 = "UPDATE user SET nombre='"+req.body.nombre+"', apellido='"+req.body.apellido+"', email='"+req.body.email+"', telefono='"+req.body.telefono+"' WHERE cedula="+req.body.userid;
  let query = mysqlConnection.query(sql2, (err, results) => {
    if(err) throw err;
    let sql = "UPDATE cliente SET direccion='"+req.body.direccion+"' WHERE userid="+req.body.userid;
    let query2 = mysqlConnection.query(sql, (err, results) =>{
      if(err) throw err;
    });
    res.redirect('/registro');
  }); 
});
app.post('/vregistro/updateall', (req, res) =>{
  let sql2 = "UPDATE user SET nombre='"+req.body.nombre+"', apellido='"+req.body.apellido+"', email='"+req.body.email+"', telefono='"+req.body.telefono+"' WHERE cedula="+req.body.userid;
  let query = mysqlConnection.query(sql2, (err, results) => {
    if(err) throw err;
    let sql = "UPDATE cliente SET direccion='"+req.body.direccion+"' WHERE userid="+req.body.userid;
    let query2 = mysqlConnection.query(sql, (err, results) =>{
      if(err) throw err;
    });
    res.redirect('/vregistro/'+req.body.vendedorid);
  }); 
});

// registro para vendedor
app.get('/vregistro/:id', (req, res) =>{
  var user;
  var idv;
  let usql = "select idvendedor, nombre, apellido from user u, vendedor v where v.userid = u.cedula and v.idvendedor = "+req.params.id;
  let uquery = mysqlConnection.query(usql, (uerr, uresults) =>{
    if(uerr) throw uerr;
    user = ""+uresults[0].nombre+" "+uresults[0].apellido;
    idv = uresults[0].idvendedor;
  });
  let sql = "select userid, valor, vendedorid, nombrestadoventa as estado, nombre, apellido, email, telefono, direccion from registro r, cliente c, user u, estadoventa e where r.clienteid = c.userid and c.userid = u.cedula and r.estadoid = e.idestadoventa and vendedorid = "+req.params.id;
  let query = mysqlConnection.query(sql, (err, results) =>{
    if(err) throw err;  
    res.render('vregistro_view', {
       results: results,
       user: user,
       idv: idv
    });
  });
});

app.post('/vregistro/save/', (req, res) =>{
  let d1 = {cedula: req.body.cedula};
  let s1 = "SELECT * FROM user WHERE cedula = ?":
  let q1 = mysqlConnection.query(s1, d1, (e1, r1) =>{
    if(e1) throw e1;
    var l1 = r1.length;
    if(l1>0){
      res.redirect('/alreg/'+req.body.vendedorid);
    }
  });
  let data = {cedula: req.body.cedula, nombre: req.body.nombre, apellido: req.body.apellido, email: req.body.email, telefono: req.body.telefono};
  let sql = "INSERT INTO user SET ?";
  const vendedorid = req.body.vendedorid;
  const clienteid = req.body.cedula;
  let query = mysqlConnection.query(sql, data,(err, results) => {
    if(err) throw err;
    let data2 = {userid: req.body.cedula, direccion: req.body.direccion};
    let sql2 = "INSERT INTO cliente SET ?";
    let q2 = mysqlConnection.query(sql2, data2, (err2, results2)=>{
      if(err2) throw err2;
      let data3 = {clienteid, vendedorid};
      let sql3 = "INSERT INTO registro SET ?";
      let qc = mysqlConnection.query(sql3, data3, (err3, results3) =>{
        if(err3) throw err3;
      });
    });
    res.redirect('/vregistro/'+req.body.vendedorid);
  });
});

app.get('/', (req, res) =>{
  res.render('login_view', {
    
  });
});

app.post('/login', (req, res) =>{
  var username = req.body.cedula;
  var password = req.body.contraseña;
  if(username && password){
    mysqlConnection.query('SELECT * FROM vendedor WHERE userid = ? AND contraseñavendedor = ?', [username, password], function(err, results2){
      if(err) throw err;
      var leng = results2.length;
      if(leng > 0){
        req.session.loggedin = true;
        req.session.username = username;
        var un = results2[0].idvendedor;
        var dir = "/vregistro/"+un;
        res.redirect(dir);
      }else{
        mysqlConnection.query('SELECT * FROM administrador WHERE userid = ? AND contraseñaadministrador = ?', [username, password], function(err3, results3){
        if(err3) throw err3;
        var lengt = results3.length;
        if(lengt > 0){
          req.session.loggedin = true;
          req.session.username = username;
          res.redirect('/clientes');
        }else{
          mysqlConnection.query('SELECT * FROM asesor WHERE userid = ? AND contraseñaasesor = ?', [username, password], function(err4, results4){
            if (err4) throw err4;
            var lengh = results4.length;
            if(lengh > 0){
              req.session.loggedin = true;
              req.session.username = username;
              var un = results4[0].idasesor;
              var dir = "/aregistro/"+un;
              res.redirect(dir);
            }else{
              res.redirect('/in');
            }
          });
        }
        });
      }
    });
  }else{
    res.send('Ingrese Nombre de Usuario y Contraseña');
  }
});

app.get('/in', (req, res)=>{
  res.render('in_view', {
    
  });
});

app.get('/regsus', (req, res)=>{
  res.render('regsus_view', {
    
  });
});

app.get('/logout',  (req, res) =>{
  req.session.loggedin = false;
  res.redirect('/');
});

app.get('/register', (req, res) =>{
  res.render('reg_view', {
    
  });
});

app.post('/reg', (req, res) =>{
  let data = {cedula: req.body.cedula, nombre: req.body.nombre, apellido: req.body.apellido, email: req.body.email, telefono: req.body.telefono};
  let sql = "INSERT INTO user SET ?";
  let query = mysqlConnection.query(sql, data,(err, results) => {
    if(err) throw err;
    let data2 = {userid: req.body.cedula, contraseñavendedor: req.body.contraseña};
    let sql2 = "INSERT INTO vendedor SET ?";
    let q2 = mysqlConnection.query(sql2, data2, (err2, results)=>{
      if(err2) throw err2;
    });
    res.redirect('/regsus');
  });
});

// registro para asesores
app.get('/aregistro/:id', (req, res) =>{
  var user;
  var idv;
  let usql = "select idasesor, nombre, apellido from user u, asesor v where v.userid = u.cedula and v.idasesor = "+req.params.id;
  let uquery = mysqlConnection.query(usql, (uerr, uresults) =>{
    if(uerr) throw uerr;
    user = ""+uresults[0].nombre+" "+uresults[0].apellido;
    idv = uresults[0].idasesor;
  });
  let sql = "select asesorid, id, userid, valor, nombre, apellido, email, telefono, direccion from asignacion a, registro r, cliente c, user u where a.registroid = r.id and r.clienteid = c.userid and r.estadoid = 3 and c.userid = u.cedula and asesorid = "+req.params.id;
  let query = mysqlConnection.query(sql, (err, results) =>{
    if(err) throw err;  
    res.render('aregistro_view', {
       results: results,
       user: user,
       idv: idv
    });
  });
});

app.get('/alreg/:id', (req, res)=>{
  var user;
  var idv;
  let usql = "select idvendedor, nombre, apellido from user u, vendedor v where v.userid = u.cedula and v.idvendedor = "+req.params.id;
  let uquery = mysqlConnection.query(usql, (uerr, uresults) =>{
    if(uerr) throw uerr;
    user = ""+uresults[0].nombre+" "+uresults[0].apellido;
    idv = uresults[0].idvendedor;
  });
  let sql = "select userid, valor, vendedorid, nombrestadoventa as estado, nombre, apellido, email, telefono, direccion from registro r, cliente c, user u, estadoventa e where r.clienteid = c.userid and c.userid = u.cedula and r.estadoid = e.idestadoventa and vendedorid = "+req.params.id;
  let query = mysqlConnection.query(sql, (err, results) =>{
    if(err) throw err;  
    res.render('alreg_view', {
       results: results,
       user: user,
       idv: idv
    });
  });
});