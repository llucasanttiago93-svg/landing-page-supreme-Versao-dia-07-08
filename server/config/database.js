import mysql from "mysql2/promise";


/* =====================================================
   POOL DE CONEXÕES MYSQL
===================================================== */

const pool = mysql.createPool({

  host:
    process.env.DB_HOST,

  port:
    Number(process.env.DB_PORT) || 3306,

  user:
    process.env.DB_USER,

  password:
    process.env.DB_PASSWORD,

  database:
    process.env.DB_NAME,

  waitForConnections:
    true,

  connectionLimit:
    10,

  queueLimit:
    0,

});


/* =====================================================
   TESTAR CONEXÃO
===================================================== */

export async function testarBanco() {

  let connection;

  try {

    connection =
      await pool.getConnection();


    console.log(
      "================================="
    );

    console.log(
      "MYSQL CONECTADO COM SUCESSO"
    );

    console.log(
      "Host:",
      process.env.DB_HOST
    );

    console.log(
      "Porta:",
      process.env.DB_PORT
    );

    console.log(
      "Usuário:",
      process.env.DB_USER
    );

    console.log(
      "Banco:",
      process.env.DB_NAME
    );

    console.log(
      "================================="
    );


  } catch (error) {

    console.error(
      "================================="
    );

    console.error(
      "❌ ERRO AO CONECTAR AO MYSQL"
    );

    console.error(
      "================================="
    );

    console.error(
      "Mensagem:",
      error.message
    );

    console.error(
      "Código:",
      error.code
    );

    console.error(
      "Número:",
      error.errno
    );

    console.error(
      "SQL State:",
      error.sqlState
    );

    console.error(
      "Host:",
      process.env.DB_HOST
    );

    console.error(
      "Porta:",
      process.env.DB_PORT
    );

    console.error(
      "Usuário:",
      process.env.DB_USER
    );

    console.error(
      "Banco:",
      process.env.DB_NAME
    );

    console.error(
      "================================="
    );


    throw error;

  } finally {

    if (connection) {

      connection.release();

    }

  }

}


/* =====================================================
   EXPORTAR POOL
===================================================== */

export default pool;