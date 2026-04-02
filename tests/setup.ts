// Set required environment variables for tests before any module imports
process.env.DATABASE_URL =
  process.env.DATABASE_URL ?? 'mysql://user:password@localhost:3306/sofman';
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_EXPIRES_IN = '1d';
process.env.AUTH_EMAIL = 'admin@smartnew.com';
process.env.AUTH_PASSWORD = 'smartnew2024';
process.env.AUTH_CLIENT_ID = '405';
process.env.NODE_ENV = 'test';
