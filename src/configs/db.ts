export const dbConfig: any = {
  user: process.env.NEXT_PUBLIC_DB_USER,
  password: process.env.NEXT_PUBLIC_DB_PASS,
  server: process.env.NEXT_PUBLIC_DB_HOST,
  database: process.env.NEXT_PUBLIC_DN_NAME,
  options: {
    encrypt: true,
    enableArithAbort: true
  }
}
