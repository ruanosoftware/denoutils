import { Server } from 'https://deno.land/std@0.107.0/http/server.ts'
import { GraphQLHTTP } from 'https://deno.land/x/gql@1.1.1/mod.ts'
import { makeExecutableSchema } from 'https://deno.land/x/graphql_tools@0.0.2/mod.ts'
import { gql } from 'https://deno.land/x/graphql_tag@0.0.1/mod.ts'

import { personas } from 'https://rr-deno.netlify.app/graphql/personas.js'

const typeDefs = gql`
  type Address {
    street: String!
    city: String!
  }

  type Person {
    id: ID!
    first_name: String!
    last_name: String!
    full_name: String
    email: String!
    gender: String!
    ip_address: String!
    address: Address!
  }

  type Query {
    personCount: Int!
    allPersons: [Person]!
    findPerson(name: String!): Person
  }

  type Mutation {
      addPerson(
        first_name: String!
        last_name: String!
        email: String!
        gender: String!
        ip_address: String
        street: String!
        city: String!
      ): Person
  }
`

const resolvers = { 
  Query: { 
    personCount: () => personas.length,
    allPersons: () => personas,
    findPerson: (root, args) => {
      return personas.find(persona => persona.first_name === args.name)
    }
  },
  Mutation: {
    addPerson: (root, args) => {
        const persona = {
            ...args, id: '999'
        };

        personas.push(persona);

        return persona;
    }
  },
  Person: {
    full_name: (root) => `${root.first_name} ${root.last_name}`,
    address: (root) => {
      return {
        street: root.street,
        city: root.city
      }
    }
  }
}

const s = new Server({
  handler: async (req) => {
    const { pathname } = new URL(req.url)

    return pathname === '/graphql'
      ? await GraphQLHTTP<Request>({
          schema: makeExecutableSchema({ resolvers, typeDefs }),
          graphiql: true
        })(req)
      : new Response('Not Found', { status: 404 })
  },
  addr: ':3000'
})

s.listenAndServe()



//const myUUID = crypto.randomUUID();
