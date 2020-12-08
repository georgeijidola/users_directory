const axios = require("axios")
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
  buildSchema,
} = require("graphql")

// User type
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    age: { type: GraphQLInt },
  }),
})

// // User type
// const UserType = buildSchema(`
//     type User {
//         id: String,
//         name: String,
//         email: String,
//         age: Int
//     }
// `)

const SingleDataResponseType = new GraphQLObjectType({
  name: "SingleDataResponseType",
  fields: () => ({
    message: { type: GraphQLString },
    error: { type: GraphQLBoolean },
    data: { type: UserType },
  }),
})

const ManyDataResponseType = new GraphQLObjectType({
  name: "ManyDataResponseType",
  fields: () => ({
    message: { type: GraphQLString },
    error: { type: GraphQLBoolean },
    data: { type: new GraphQLList(UserType) },
  }),
})

// Root query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: SingleDataResponseType,

      args: { id: { type: GraphQLString } },

      async resolve(parentValue, args) {
        const { data } = await axios.get(
          "http://localhost:3000/users/" + args.id
        )
        return { error: false, data }
      },
    },
    users: {
      type: ManyDataResponseType,

      async resolve(parentValue, args) {
        const { data } = await axios.get("http://localhost:3000/users/")

        return { error: false, data }
      },
    },
  },
})

// Mutations
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: SingleDataResponseType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },

      async resolve(parentValue, args) {
        const { data } = await axios.post("http://localhost:3000/users/", args)

        return { message: "User created successfully", error: false, data }
      },
    },

    updateUser: {
      type: SingleDataResponseType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt },
      },

      async resolve(parentValue, args) {
        const { data } = await axios.put(
          "http://localhost:3000/users/" + args.id,
          args
        )

        return { message: "User updated", error: false, data }
      },
    },

    deleteUser: {
      type: SingleDataResponseType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parentValue, args) {
        const { data } = await axios.delete(
          "http://localhost:3000/users/" + args.id
        )

        return { message: "User deleted", error: false, data }
      },
    },
  },
})

module.exports = new GraphQLSchema({ query: RootQuery, mutation })
