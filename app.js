var http = require("http");
var pug = require("pug");
var qs = require("querystring");
var url = require("url");
var fs = require("fs");
var formidable = require("formidable");
var path = require("path");
var NodeSession = require("node-session");
var md5;

//? Mendekalarasikan port....................................
const port = process.env.PORT


//? Jalur atau Path file Template Halaman Utama yang kita butuhkan........
const utama = "./templatesUtama/utama.pug";


//? Jalur atau Path file Template Halaman Admin yang kita butuhkan........
const admin = "./templatesAdmin/admin.pug";


//? Jalur Template Tabel Wisata pada halaman User.............
const userWisata = "./templateUser/templates_objekWisata/listOW.pug";

//? Jalur Template Tabel Restaurant pada halaman User.............
const userRestaurant = "./templateUser/templatesUserRestaurant/listUserRest.pug";

//? Jalur Template Tabel Penginapan pada halaman User.............
const userPenginapan = "./templateUser/templatesUserPenginapan/listUserpenginapan.pug";




//? Jalur atau Path file Template Tabel Admin yang kita butuhkan........
var listAdmin = "./templatesDataAdmin/listAdmin.pug";
var addFormAdmin = "./templatesDataAdmin/addFormAdmin.pug";
var editFormAdmin = "./templatesDataAdmin/editFormAdmin.pug";

//? Jalur atau Path file Template Buku Tamu yang kita butuhkan........
var listTamu = "./templatesBukuTamu/listTamu.pug";
var addFormTamu = "./templatesBukuTamu/addFormTamu.pug";
var editFormTamu = "./templatesBukuTamu/editFormTamu.pug";

//? Jalur atau Path file Template Objek Wisata yang kita butuhkan........
var listOW = "./templates_objekWisata/listOW.pug";
var addFormOW = "./templates_objekWisata/addFormOW.pug";
var editFormOW = "./templates_objekWisata/editFormOW.pug";

//? Jalur atau Path file Template Restaurant yang kita butuhkan........
var listRest = "./templatesRestaurant/listRest.pug";
var addFormRest = "./templatesRestaurant/addFormRest.pug";
var editFormRest = "./templatesRestaurant/editFormRest.pug";

//? Jalur atau Path file Penginapan  yang kita butuhkan........
var listPenginapan = "./templatesPenginapan/listpenginapan.pug";
var addFormPenginapan = "./templatesPenginapan/addFormpenginapan.pug";
var editFormPenginapan = "./templatesPenginapan/editFormpenginapan.pug";

//? Jalur atau Path file Testimoni yang kita butuhkan........
var listTestimoni = "./templatesTestimoni/listTestimoni.pug";
var addTestimoni = "./templatesTestimoni/addTestimoni.pug";
var editTestimoni = "./templatesTestimoni/editTestimoni.pug";

//?koneksi.................................................
const mariadb = require("mariadb");
const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "alexander",
  database: "pariwisata",
 
});

//! session------------------------------------------------------------------------
var session = new NodeSession({
  secret: "Q3UBzdH9GEfiRCTKbi5MTPyChpzXLsTD",
});

// ------------------------------

http.createServer(function (req, res) {
    session.startSession(req, res, function () {
        if (req.url === "/log" && req.method === "POST") {
        var body = "";
        req.on("data", function (data) {
          body += data;
        });
        req.on("data", function () {
          var form = qs.parse(body);
          var params = [form["user_id"], form["user_password"]];

          async function main() {
            let conn;
            try {
              let conn = await pool.getConnection();
              let rows = await conn.query(
                `
                        SELECT COUNT(*) AS cnt FROM users WHERE
                        user_id = '` +
                  params[0] +
                  `' AND user_password = '` +
                  params[1] +
                  `'`
              );
              var n = rows[0]["cnt"];
              console.log("Nilai n: " + n);
              if (n > 0) {
                req.session.put("user_id", params[0]);

                res.writeHead(302, {
                  Location: "/admin",
                });
                res.end();
              } else {
                res.writeHead(200, {
                  "Content-Type": "text/html",
                });
              }
            } catch (err) {
              throw err;
            } finally {
              if (conn) return conn.end();
            }
          }
          main();

          //----------------------------------
        });
        //! Bagian Tampilan halaman Utama user ..........
      } else if (req.url === "/") {
        async function main() {
          let conn;
          try {
            let conn = await pool.getConnection();
            let row = await conn.query("select * from tb_ow order by id_ow asc ");
            var template = pug.renderFile(utama, {
              tb_ows: row,
            });
            res.end(template);
          } catch (err) {
            throw err;
          } finally {
            if (conn) return conn.end();
          }
        }
        main();
      }

      //! Bagian tampilan Halaman Admin
      else if (req.url === "/admin") {
        async function main() {
          let conn;
          try {
            var template = pug.renderFile(admin, {});
            res.end(template);
          } catch (err) {
            throw err;
          } finally {
            if (conn) return conn.end();
          }
        }
        main();
      }
      //! Bagian Tampilan list Tabel_admin..........
      if (req.url === "/tbadmin") {
        let conn;
        async function main() {
          try {
            let conn = await pool.getConnection();
            let row = await conn.query("select * from tb_admin order by id_admin asc ");
            var template = pug.renderFile(listAdmin, {
              tb_admins: row,
            });
            res.end(template);
          } catch (err) {
            console.log("Data tb_admin gagal di seleksi");
            throw err;
          } finally {
            if (conn) return conn.end();
          }
        }
        main();
      }
     
      //! Bagian Tambah data tb_admin di browser.....................
      else if (req.url === "/add") {
        switch (req.method) {
          case "GET":
            var template = pug.renderFile(addFormAdmin);
            res.end(template);
            break;
          case "POST":
            var body = "";
            req.on("data", function (data) {
              body += data;
            });
            req.on("end", function () {
              var form = qs.parse(body);
              var newRow = [
                form["id_admin"],
                form["nama"],
                form["alamat"],
                form["telepon"],
                form["email"],
                form["password"],
              ];
              async function main() {
                let conn;
                try {
                  let conn = await pool.getConnection();
                  const query = `INSERT INTO tb_admin VALUES(?, ?, ?, ? ,?, ?)`;
                  let rows = await conn.query(query, newRow);
                  res.writeHead(302, {
                    Location: "/tbadmin",
                  });
                  res.end();
                } catch (err) {
                  console.log("Data tb_admin gagal disimpan");
                  throw err;
                  res.write.writeHead(302, {
                    Location: "/main",
                  });
                  res.end();
                } finally {
                  if (conn) return con.end();
                }
              }
              main();
            });
            break;
        }
      }
      //! Bagian Edit data tb_admin di browser......................
      else if (url.parse(req.url).pathname === "/edit") {
        switch (req.method) {
          case "GET":
            var id = qs.parse(url.parse(req.url).query).id;

            async function main() {
              let conn;
              try {
                let conn = await pool.getConnection();
                let rows = await conn.query(`select * from tb_admin where id_admin like '` + id + `'`);
                var template = pug.renderFile(editFormAdmin, {
                  tb_admin: rows[0],
                });
                res.end(template);
              } catch (err) {
                throw err;
              } finally {
                if (conn) return con.end();
              }
            }
            main();
            break;
          case "POST":
            var body = "";
            req.on("data", function (data) {
              body += data;
            });
            req.on("end", function () {
              var form = qs.parse(body);

              let nama = form["nama"];
              let alamat = form["alamat"];
              let telepon = form["telepon"];
              let email = form["email"];
              let password = form["password"];
              let id_admin = form["id_admin"];

              async function main2() {
                let conn;
                try {
                  let conn = await pool.getConnection();
                  let qr = `UPDATE tb_admin SET nama = '${nama}',alamat = '${alamat}',telepon = '${telepon}',email = '${email}',password = '${password}' WHERE id_admin LIKE '${id_admin}'`;
                  let result = await conn.query(qr);
                  // kodeuntuk redirect ke root dokumant
                  res.writeHead(302, {
                    Location: "/main",
                  });
                  res.end();
                } catch (err) {
                  throw err;
                } finally {
                  if (conn) return conn.end();
                }
              }
              main2();
            });
            break;
        }
      }
      //! Bagian Delete data tb_admin di browser...................
      else if (url.parse(req.url).pathname === "/delete") {
        //Mengambil nilai dari parameter id
        var id = qs.parse(url.parse(req.url).query).id;
        async function main() {
          let conn;
          try {
            let conn = await pool.getConnection();
            let rows = await conn.query(
              `
            DELETE FROM tb_admin WHERE id_admin LIKE '` +
                id +
                `'`
            );
            //kode untuk redirect ke root document
            res.writeHead(302, {
              Location: "/main",
            });
            res.end();
          } catch (err) {
            throw err;
          } finally {
            if (conn) return conn.end();
          }
        }
        main();
      }
      //! Bagian Tampilan Utama web / list tb_bukuTamu..........
      else if (req.url === "/tamu") {
        async function main() {
          let conn;
          try {
            let conn = await pool.getConnection();
            let row = await conn.query("select * from tb_bukutamu order by id_tamu asc ");
            var template = pug.renderFile(listTamu, {
              tb_bukutamus: row,
            });
            res.end(template);
          } catch (err) {
            console.log("Data tb_bukutamus gagal di seleksi");
            throw err;
          } finally {
            if (conn) return conn.end();
          }
        }
        main();
      }
      
      //! Bagian Tambah data tb_tamu di browser.....................
      else if (req.url === "/addTamu") {
        switch (req.method) {
          case "GET":
            var template = pug.renderFile(addFormTamu);
            res.end(template);
            break;
          case "POST":
            var body = "";
            req.on("data", function (data) {
              body += data;
            });
            req.on("end", function () {
              var form = qs.parse(body);
              var newRow = [form["id_tamu"], form["tanggal"], form["email"], form["komentar"]];
              async function main() {
                let conn;
                try {
                  let conn = await pool.getConnection();
                  const query = `INSERT INTO tb_bukutamu VALUES(?, ?, ?, ? )`;
                  let rows = await conn.query(query, newRow);
                  res.writeHead(302, {
                    Location: "/tamu",
                  });
                  res.end();
                } catch (err) {
                  console.log("Data tb_bukutamu gagal disimpan");
                  throw err;
                  res.write.writeHead(302, {
                    Location: "/main",
                  });
                  res.end();
                } finally {
                  if (conn) return con.end();
                }
              }
              main();
            });
            break;
        }
      }
      //! Bagian Edit data tb_tamu di browser......................
      else if (url.parse(req.url).pathname === "/editTamu") {
        switch (req.method) {
          case "GET":
            var id = qs.parse(url.parse(req.url).query).id;
            async function main() {
              let conn;
              try {
                let conn = await pool.getConnection();
                let rows = await conn.query(`select * from tb_bukutamu where id_tamu like '` + id + `'`);
                var template = pug.renderFile(editFormTamu, {
                  tb_bukutamu: rows[0],
                });
                res.end(template);
              } catch (err) {
                throw err;
              } finally {
                if (conn) return con.end();
              }
            }
            main();
            break;
          case "POST":
            var body = "";
            req.on("data", function (data) {
              body += data;
            });
            req.on("end", function () {
              var form = qs.parse(body);

              let id_tamu = form["id_tamu"];
              let tanggal = form["tanggal"];
              let email = form["email"];
              let komentar = form["komentar"];

              async function main() {
                let conn;
                try {
                  let conn = await pool.getConnection();
                  let qr = `UPDATE tb_bukutamu SET id_tamu = '${id_tamu}',tanggal = '${tanggal}',email = '${email}',komentar = '${komentar}' WHERE id_tamu LIKE '${id_tamu}'`;
                  let result = await conn.query(qr);
                  // kodeuntuk redirect ke root dokumant
                  res.writeHead(302, {
                    Location: "/tamu",
                  });
                  res.end();
                } catch (err) {
                  throw err;
                } finally {
                  if (conn) return conn.end();
                }
              }
              main();
            });
            break;
        }
      } //! Menghapus data pada tabel buku_tamu
      else if (url.parse(req.url).pathname === "/deleteTamu") {
        //Mengambil nilai dari parameter id
        var id = qs.parse(url.parse(req.url).query).id;
        async function main() {
          let conn;
          try {
            let conn = await pool.getConnection();
            let rows = await conn.query(
              `
        DELETE FROM tb_bukutamu WHERE id_tamu LIKE '` +
                id +
                `'`
            );
            //kode untuk redirect ke root document
            res.writeHead(302, {
              Location: "/tamu",
            });
            res.end();
          } catch (err) {
            throw err;
          } finally {
            if (conn) return conn.end();
          }
        }
        main();
      }
      //! Bagian Tampilan Utama web / list tb_ow..........
      if (req.url === "/ow") {
        async function main() {
          let conn;
          try {
            let conn = await pool.getConnection();
            let row = await conn.query("select * from tb_ow order by id_ow asc ");
            var template = pug.renderFile(listOW, {
              tb_ows: row,
            });
            res.end(template);
          } catch (err) {
            console.log("Data tb_ow gagal di seleksi");
            throw err;
          } finally {
            if (conn) return conn.end();
          }
        }
        main();
      }
     
      //! Bagian Tambah data tb_Ow di browser.....................
      else if (req.url === "/addOW") {
        let newGambarPath;
        switch (req.method) { 
          case "GET":
            var template = pug.renderFile(addFormOW);
            res.end(template);
            break;
          case "POST":
            //Membuat objek dari kelas formidable.imconfigform
            var form = new formidable.IncomingForm();
            form.parse(req, function (err, fields, files) {
              const userfile = files.userfile;
              const oldpath = userfile.filepath;
              const ext = path.extname(userfile.originalFilename);
              newGambarPath = userfile.newFilename + ext;
              const newpath = path.join(__dirname, "./uploads", newGambarPath);
              fs.renameSync(oldpath, newpath, (err) => {
                if (err) throw err;
              });
              var newRow = [
                fields["id_ow"],
                fields["nama_ow"],
                fields["lokasi"],
                fields["deskripsi"],
                fields["tarif"],
                newGambarPath,
              ];
              async function main() {
                let conn;
                try {
                  let conn = await pool.getConnection();
                  const query = `INSERT INTO tb_ow VALUES(?, ?, ?, ? , ? , ?)`;
                  let rows = await conn.query(query, newRow);
                  res.writeHead(302, {
                    Location: "/ow",
                  });
                  res.end();
                } catch (err) {
                  console.log("Data tb_ow gagal disimpan");
                  throw err;
                  res.write.writeHead(302, {
                    Location: "/ow",
                  });
                  res.end();
                } finally {
                  if (conn) return con.end();
                }
              }
              main();
            });

            break;
        }
      }
     //! Bagian Edit data tb_ow di browser......................
     else if (url.parse(req.url).pathname === "/editOW") {
      let newGambarPath;

      switch (req.method) {
        case "GET":
          var id = qs.decode(url.parse(req.url).query).id;
          async function main() {
            let conn;
            try {
              let conn = await pool.getConnection();
              let rows = await conn.query(`select * from tb_ow where id_ow like '` + id + `'`);
              var template = pug.renderFile(editFormOW, {
                tb_ow: rows[0],
              });
              res.end(template);
            } catch (err) {
              throw err;
            } finally {
              if (conn) return con.end();
            }
          }
          main();
          break;
            case "POST":
              let newGambarPath;
              //Membuat objek dari kelas formidable.imconfigform
              var form = new formidable.IncomingForm();
              form.parse(req, function (err, fields, files) {
                const userfile = files.userfile;
                const oldpath = userfile.filepath;
                const ext = path.extname(userfile.originalFilename);
                newGambarPath = userfile.newFilename + ext;
                const newpath = path.join(__dirname, "./uploads", newGambarPath);
                fs.renameSync(oldpath, newpath, (err) => {
                  if (err) throw err;
                });
                var newRow = [
                   nama = fields["nama_ow"],
                   lokasi = fields["lokasi"],
                   deskripsi = fields["deskripsi"],
                   tarif = fields["tarif"],
                   gambar = fields['userfile'],
                   id = fields["id_ow"],
                ];
                async function main() {
                  let conn;
                  try {
                    let conn = await pool.getConnection();
                    const query = `UPDATE tb_ow SET nama_ow = '${nama}' , lokasi ='${lokasi}', deskripsi ='${deskripsi}', tarif ='${tarif}' , gambar ='${gambar}' 
                    WHERE id_ow LIKE '${id}'`
                    let rows = await conn.query(query, newRow);
                    res.writeHead(302, {
                      Location: "/ow",
                    });
                    res.end();
                  } catch (err) {
                    console.log("Data tb_ow gagal disimpan");
                    throw err;
                    res.write.writeHead(302, {
                      Location: "/ow",
                    });
                    res.end();
                  } finally {
                    if (conn) return con.end();
                  }
                }
                main();
              });
  
              break;
          }
      }
      //! Bagian Delete data tb_ow di browser...................
      else if (url.parse(req.url).pathname === "/deleteOW") {
        //Mengambil nilai dari parameter id
        var id = qs.parse(url.parse(req.url).query).id;
        async function main() {
          let conn;
          try {
            let conn = await pool.getConnection();
            let rows = await conn.query(
              `
            DELETE FROM tb_ow WHERE id_ow LIKE '` +
                id +
                `'`
            );
            //kode untuk redirect ke root document
            res.writeHead(302, {
              Location: "/ow",
            });
            res.end();
          } catch (err) {
            throw err;
          } finally {
            if (conn) return conn.end();
          }
        }
        main();
      }
     
      //! BAGIAN TAMPILAN LIST RESTORANT HALAMAN ADMIN.............
      if (req.url === "/rest") {
        async function main() {
          let conn;
          try {
            let conn = await pool.getConnection();
            let rows = await conn.query("select * from retaurant order by id_rest asc ");
            var template = pug.renderFile(listRest, {
              retaurants: rows,
            });
            res.end(template);
          } catch (err) {
            console.log("Data tb_ow gagal di seleksi");
            throw err;
          } finally {
            if (conn) return conn.end();
          }
        }
        main();
      }

      //! BAGIAN TAMBAH DATA RESTORANT DI HALAMAN ADMIN...........
      else if (req.url === "/addRest") {
         let newGambarPath;
        switch (req.method) { 
          case "GET":
            var template = pug.renderFile(addFormRest);
            res.end(template);
            break;
          case "POST":
            //Membuat objek dari kelas formidable.imconfigform
            var form = new formidable.IncomingForm();
            form.parse(req, function (err, fields, files) {
              const userfile = files.userfile;
              const oldpath = userfile.filepath;
              const ext = path.extname(userfile.originalFilename);
              newGambarPath = userfile.newFilename + ext;
              const newpath = path.join(__dirname, "./uploads", newGambarPath);
              fs.renameSync(oldpath, newpath, (err) => {
                if (err) throw err;
              });
              var newRow = [
                fields["id_rest"],
                fields["nama_rest"],
                fields["lokasi_rest"],
                fields["deskripsi"],
                newGambarPath,
              ];
              async function main() {
                let conn;
                try {
                  let conn = await pool.getConnection();
                  const query = `INSERT INTO retaurant VALUES(?, ?, ?, ? , ? )`;
                  let rows = await conn.query(query, newRow);
                  res.writeHead(302, {
                    Location: "/rest",
                  });
                  res.end();
                } catch (err) {
                  console.log("Data tb_rest gagal disimpan");
                  throw err;
                  res.write.writeHead(302, {
                    Location: "/ow",
                  });
                  res.end();
                } finally {
                  if (conn) return con.end();
                }
              }
              main();
            });

            break;
        }
      }
      //! Bagian Edit data Resturant di browser......................
      else if (url.parse(req.url).pathname === "/editRest") {
        switch (req.method) {
          case "GET":
            var id = qs.parse(url.parse(req.url).query).id;
            async function main() {
              let conn;
              try {
                let conn = await pool.getConnection();
                let rows = await conn.query(`select * from retaurant where id_rest like '` + id + `'`);
                var template = pug.renderFile(editFormRest, {
                  tb_ow: rows[0],
                });
                res.end(template);
              } catch (err) {
                throw err;
              } finally {
                if (conn) return con.end();
              }
            }
            main();
            break;
          case "POST":
            var body = "";
            req.on("data", function (data) {
              body += data;
            });
            req.on("end", function () {
              var form = qs.parse(body);

              let nama_rest = form["nama_rest"];
              let lokasi = form["lokasi_rest"];
              let jam_operasi = form["keterangan_rest"];
              let id_ow = form["id_rest"];

              async function main() {
                let conn;
                try {
                  let conn = await pool.getConnection();
                  let qr = `UPDATE retaurant SET nama_rest = '${nama_rest}',lokasi_rest = '${lokasi}',keterangan_rest = '${jam_operasi}'  WHERE id_rest LIKE '${id_ow}'`;
                  let result = await conn.query(qr);
                  // kodeuntuk redirect ke root dokumant
                  res.writeHead(302, {
                    Location: "/ow",
                  });
                  res.end();
                } catch (err) {
                  throw err;
                } finally {
                  if (conn) return conn.end();
                }
              }
              main();
            });
            break;
        }
      }
   
    //! Bagian delete Data Restaurant......................
    else if (url.parse(req.url).pathname === "/deleteRest") {
        //Mengambil nilai dari parameter id
        var id = qs.parse(url.parse(req.url).query).id;
        async function main() {
          let conn;
          try {
            let conn = await pool.getConnection();
            let rows = await conn.query(
              `
            DELETE FROM retaurant WHERE id_rest LIKE '` +
                id +
                `'`
            );
            //kode untuk redirect ke root document
            res.writeHead(302, {
              Location: "/rest",
            });
            res.end();
          } catch (err) {
            throw err;
          } finally {
            if (conn) return conn.end();
          }
        }
        main();
      }
    //! BAGIAN LIST PENGINAPAN UNTUK HALAM ADMIN.............
    if (req.url === "/peng") {
      async function main() {
        let conn;
        try {
          let conn = await pool.getConnection();
          let row = await conn.query("select * from penginapan order by id_peng asc ");
          var template = pug.renderFile(listPenginapan, {
            penginapans: row,
          });
          res.end(template);
        } catch (err) {
          console.log("Data tb_ow gagal di seleksi");
          throw err;
        } finally {
          if (conn) return conn.end();
        }
      }
      main();
    }
  //! Tambah data untuk tabel penginapan...............................
    else if (req.url === "/addPeng") {
      let newGambarPath;
     switch (req.method) { 
       case "GET":
         var template = pug.renderFile(addFormPenginapan);
         res.end(template);
         break;
       case "POST":
         //Membuat objek dari kelas formidable.imconfigform
         var form = new formidable.IncomingForm();
         form.parse(req, function (err, fields, files) {
           const userfile = files.userfile;
           const oldpath = userfile.filepath;
           const ext = path.extname(userfile.originalFilename);
           newGambarPath = userfile.newFilename + ext;
           const newpath = path.join(__dirname, "./uploads", newGambarPath);
           fs.renameSync(oldpath, newpath, (err) => {
             if (err) throw err;
           });
           var newRow = [
             fields["id_peng"],
             fields["nama_peng"],
             fields["lokasi_peng"],
             fields["keterangan_peng"],
             newGambarPath,
           ];
           async function main() {
             let conn;
             try {
               let conn = await pool.getConnection();
               const query = `INSERT INTO penginapan VALUES(?, ?, ?, ? , ? )`;
               let rows = await conn.query(query, newRow);
               res.writeHead(302, {
                 Location: "/peng",
               });
               res.end();
             } catch (err) {
               console.log("Data Penginapan gagal disimpan");
               throw err;
               res.write.writeHead(302, {
                 Location: "/ow",
               });
               res.end();
             } finally {
               if (conn) return con.end();
             }
           }
           main();
         });

         break;
     }
   } //! Bagian Edit data Penginapan di browser......................
   else if (url.parse(req.url).pathname === "/editPeng") {
     switch (req.method) {
       case "GET":
         var id = qs.parse(url.parse(req.url).query).id;
         async function main() {
           let conn;
           try {
             let conn = await pool.getConnection();
             let rows = await conn.query(`select * from penginapan where id_peng like '` + id + `'`);
             var template = pug.renderFile(editFormPenginapan, {
               penginapan: rows[0],
             });
             res.end(template);
           } catch (err) {
             throw err;
           } finally {
             if (conn) return con.end();
           }
         }
         main();
         break;
       case "POST":
         var body = "";
         req.on("data", function (data) {
           body += data;
         });
         req.on("end", function () {
           var form = qs.parse(body);

           let nama_peng = form["nama_peng"];
           let lokasi_peng = form["lokasi_peng"];
           let ket_peng = form["keterangan_peng"];
           let id_peng = form["id_peng"];

           async function main() {
             let conn;
             try {
               let conn = await pool.getConnection();
               let qr = `UPDATE retaurant SET nama_rest = '${nama_rest}',lokasi_rest = '${lokasi}',keterangan_rest = '${jam_operasi}'  WHERE id_rest LIKE '${id_ow}'`;
               let result = await conn.query(qr);
               // kodeuntuk redirect ke root dokumant
               res.writeHead(302, {
                 Location: "/peng",
               });
               res.end();
             } catch (err) {
               throw err;
             } finally {
               if (conn) return conn.end();
             }
           }
           main();
         });
         break;
     }
   }

 //! Bagian delete Data Penginapan......................
 else if (url.parse(req.url).pathname === "/deletePeng") {
     //Mengambil nilai dari parameter id
     var id = qs.parse(url.parse(req.url).query).id;
     async function main() {
       let conn;
       try {
         let conn = await pool.getConnection();
         let rows = await conn.query(
           `
         DELETE FROM penginapan WHERE id_peng LIKE '` +
             id +
             `'`
         );
         //kode untuk redirect ke root document
         res.writeHead(302, {
           Location: "/peng",
         });
         res.end();
       } catch (err) {
         throw err;
       } finally {
         if (conn) return conn.end();
       }
     }
     main();
   }


















   //! BAGIAN HALAMAN LIST TESTIMONI...............
    if (req.url === "/testi") {
      async function main() {
        let conn;
        try {
          let conn = await pool.getConnection();
          let row = await conn.query("select * from testimoni order by id_user asc ");
          var template = pug.renderFile(listTestimoni, {
            testimonis: row,
          });
          res.end(template);
        } catch (err) {
          console.log("Data testimoni gagal di seleksi");
          throw err;
        } finally {
          if (conn) return conn.end();
        }
      }
      main();
    }
  //! Tambah data untuk tabel TESTIMONI...............................
    else if (req.url === "/addTesti") {
      let newGambarPath;
      switch (req.method){
        case "GET" :
          var template = pug.renderFile(addTestimoni);
          res.end(template);
          break;

      case "POST" :
        // Membuat objek dari kelas formidable.imconfigform
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files){
          const userfile = files.userfile;
          const oldpath = userfile.filepath;
          const ext  = path.extname(userfile.originalFilename);
          newGambarPath = userfile.newFilename + ext;
          const newpath = path.join(__dirname,"./uploads", newGambarPath)

          fs.renameSync(oldpath, newpath, (err) =>{
            if (err) throw err;
          });

          var newRow =[
            fields["id_user"],
            fields["username"],
            fields["komentar"],
            newGambarPath,
          ]

          async function main(){
            let conn;
            try{
              let conn = await pool.getConnection();
              const query = 'INSERT INTO testimoni VALUES(?,?,?,?)'

              let rows = await conn.query(query, newRow);
              res.writeHead(302, {
                Location:"/testi",
              })
              res.end()
            }catch (err){
              console.log("Data Testimoni gagal disimpan");
              throw err;
              res.write.writeHead(302, {
                Location: "/rest"
              })
              res.end();
            }finally{
              if (conn) return con.end();
            }
          }
          main();
        })
        break;
    }
  }
  
  //! Bagian Edit data TESTIMONI di browser......................
  else if (url.parse(req.url).pathname === "/editTesti") {
    switch (req.method) {
      case "GET":
        var id = qs.parse(url.parse(req.url).query).id;
        async function main() {
          let conn;
          try {
            let conn = await pool.getConnection();
            let rows = await conn.query(`select * from penginapan where id_peng like '` + id + `'`);
            var template = pug.renderFile(editTestimoni, {
              penginapan: rows[0],
            });
            res.end(template);
          } catch (err) {
            throw err;
          } finally {
            if (conn) return con.end();
          }
        }
        main();
        break;
      case "POST":
        var body = "";
        req.on("data", function (data) {
          body += data;
        });
        req.on("end", function () {
          var form = qs.parse(body);

          let nama_peng = form["nama_peng"];
          let lokasi_peng = form["lokasi_peng"];
          let ket_peng = form["keterangan_peng"];
          let id_peng = form["id_peng"];

          async function main() {
            let conn;
            try {
              let conn = await pool.getConnection();
              let qr = `UPDATE retaurant SET nama_rest = '${nama_rest}',lokasi_rest = '${lokasi}',keterangan_rest = '${jam_operasi}'  WHERE id_rest LIKE '${id_ow}'`;
              let result = await conn.query(qr);
              // kodeuntuk redirect ke root dokumant
              res.writeHead(302, {
                Location: "/testi",
              });
              res.end();
            } catch (err) {
              throw err;
            } finally {
              if (conn) return conn.end();
            }
          }
          main();
        });
        break;
    }
  }

//! Bagian delete Data TESTIMONI......................
else if (url.parse(req.url).pathname === "/deleteTesti") {
    //Mengambil nilai dari parameter id
    var id = qs.parse(url.parse(req.url).query).id;
    async function main() {
      let conn;
      try {
        let conn = await pool.getConnection();
        let rows = await conn.query(
          `
        DELETE FROM testimoni WHERE id_user LIKE '` +
            id +
            `'`
        );
        //kode untuk redirect ke root document
        res.writeHead(302, {
          Location: "/testi",
        });
        res.end();
      } catch (err) {
        throw err;
      } finally {
        if (conn) return conn.end();
      }
    }
    main();
  }

















//? KUMPULAN JALUR ROOTING UTUK HALAMAN USER/UTAMA................................................
    
    //! BAGIAN LIST PENGINAPAN UNTUK HALAMAN USER.............
    else if (req.url === "/userpeng") {
      async function main() {
        let conn;
        try {
          let conn = await pool.getConnection();
          let row = await conn.query("select * from penginapan order by id_peng asc ");
          var template = pug.renderFile(userPenginapan, {
            penginapans: row,
          });
          res.end(template);
        } catch (err) {
          console.log("Data tb_ow gagal di seleksi");
          throw err;
        } finally {
          if (conn) return conn.end();
        }
      }
      main();
    }
     //! BAGIAN TAMPILAN LIST RESTORANT HALAMAN USER.............
     if (req.url === "/userrest") {
      async function main() {
        let conn;
        try {
          let conn = await pool.getConnection();
          let row = await conn.query("select * from retaurant order by id_rest asc ");
          var template = pug.renderFile(userRestaurant, {
            retaurans: row,
          });
          res.end(template);
        } catch (err) {
          console.log("Data tb_ow gagal di seleksi");
          throw err;
        } finally {
          if (conn) return conn.end();
        }
      }
      main();
    }
    
    // //! BAGIAN HALAMAN LIST TESTIMONI...............
    // if (req.url === "/userTesti") {
    //   async function main() {
    //     let conn;
    //     try {
    //       let conn = await pool.getConnection();
    //       let row = await conn.query("select * from testimoni order by id_user asc ");
    //       var template = pug.renderFile(listTestimoni, {
    //         testimonis: row,
    //       });
    //       res.end(template);
    //     } catch (err) {
    //       console.log("Data testimoni gagal di seleksi");
    //       throw err;
    //     } finally {
    //       if (conn) return conn.end();
    //     }
    //   }
    //   main();
    // }
















  //! Menambahkan Css dan file format png ........................................
    else if (
      req.url.endsWith(".css") ||
      req.url.endsWith(".jpg") ||
      req.url.endsWith(".icons") ||
      req.url.endsWith(".jpeg") ||
      req.url.endsWith(".png")
    ) {
      fs.readFile(__dirname + req.url, function (err, data) {
        if (err) {
          res.writeHead(404);
          res.end(JSON.stringify(err));
          return;
        }
        res.writeHead(200);
        res.end(data);
      });
    }
  })
  })
  .listen(port, () => {
    console.log(`Server aktif di http://localhost:${port}`);
  });
