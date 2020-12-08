const express = require("express")
const cors = require("cors")
const { graphqlHTTP } = require("express-graphql")
const schema = require("./schema")

const app = express()

// enable `cors` to set HTTP response header: Access-Control-Allow-Origin: *
app.use(cors())

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
)

app.listen(4000, () => console.log("Server running on port 4000..."))
