const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();

// Abrir la conexión a la base de datos
let db = new sqlite3.Database('mydb.sqlite', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Conexión a la base de datos establecida.');
    // Crear la tabla
    db.run(`
      CREATE TABLE IF NOT EXISTS mi_tabla (
        id INTEGER PRIMARY KEY,
        dato TEXT,
        otro_dato TEXT NULL,
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Tabla creada o ya existente.');
      }
    });
  }
});

// Body parser para procesar el cuerpo de la solicitud POST
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

app.get('/client.js', (req, res) => res.sendFile(__dirname + '/client.js', { type: 'text/javascript' }));
app.get('/style.css', (req, res) => res.sendFile(__dirname + '/style.css', { type: 'text/css' }));

app.get('/datos', function(req, res) {
  db.all(`
      SELECT dato
      FROM mi_tabla
      ORDER BY fecha DESC
  `, function(err, rows) {
    if (err) {
      console.error(err.message);
      res.status(500).send('Error interno del servidor');
    } else {
      const datos = rows.map(row => row.dato);
      res.send({ datos: datos });
    }
  });
});

app.post('/procesar', function(req, res) {
  const dato = req.body.dato; // Obtener el valor del campo de texto
  console.log('El dato enviado es:', dato);
  
  // Insertar un nuevo registro en la tabla
  db.run(`
    INSERT INTO mi_tabla (dato, otro_dato)
    VALUES (?, ?)
  `, [dato, null], function(err) {
    if (err) {
      console.error(err.message);
    } else {
      console.log(`Se insertó un nuevo registro con el ID ${this.lastID}`);
      res.send(`El dato enviado (${dato}) ha sido guardado en la base de datos.`);
    }
  });
});

app.listen(3000, function() {
  console.log('El servidor está corriendo en el puerto 3000.');
});