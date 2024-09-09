import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Stock Post API",
      version: "1.0.0",
      description:
        "API documentation for user posting things related to stock and others can comment and like his post, with authentication and file upload",
    },
    servers: [
      {
        url: "http://localhost:7056/api",
        description: "Development server",
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Adjust the path as necessary
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
