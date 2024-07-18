const swaggerAutogen = require('swagger-autogen')();  // Initialize swagger-autogen

const doc = {
  info: {
    title: 'Job Portal Application',
    description: 'Node Expressjs Job Portal Application',
  },
  host: 'https://sanjib-job-portal-api-4qzs.onrender.com/',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';  // Output file path
const routes = ['./server.js'];  // Your server entry file

// Generate Swagger documentation
swaggerAutogen(outputFile, routes, doc).then(() => {
  require('./server.js');  // Start your server after documentation is generated
});
