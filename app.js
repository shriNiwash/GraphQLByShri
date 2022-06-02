const {ApolloServer,gql} = require('apollo-server-express');
const express = require('express');
const app = express();
const mongoose  = require('mongoose');

const conn = "mongodb://127.0.0.1/books";
mongoose.connect(conn,{useUnifiedTopology:true,useNewUrlParser:true})
.then(()=>console.log('Database Connected successfully')).catch((err)=>console.log(err));
//schema declration
const Bookschema = mongoose.Schema({
    name:{
        type:String,
    },
    sold:{
        type:Number
    },
    image:{
        type:String,
    }
})

// creating new model
const BookModel = mongoose.model('BookModel',Bookschema);

app.get('/data',async(req,res)=>{
    const data = await BookModel.find();
    res.json(data);
    
});

const typeDefs = gql`
type Book {
    id:String
    name:String
    sold:Int
    image:String
}
type Query{
    getbooks:[Book]
    getBook(id:Int!):Book!
}

type Mutation{
    createBook(name:String!,sold:Int!,image:String!):Book!
    updateBook(_id:String!,name:String,sold:Int,image:String):Book
    deleteBook(_id:String!):Book
}
`;



const resolvers = {
    Query:{
        getbooks:async()=> {
            const data = await BookModel.find();
            return data;
        },
        getBook:(parent,{id})=>{
            console.log(id);
            return books[id];
        }
    },
    Mutation:{
        createBook:async(parent,args,context,info)=>{
            console.log(args);
            // const {name,sold,image} = agrs;
            const insert = new BookModel(args);
            const result = await insert.save()
            return args;

        },
        updateBook:async(parent,args)=>{
            const id = args._id;
            const name=args.name;
            const sold=args.sold;
            const image = args.image;
            console.log(id);
            const datas = await BookModel.findByIdAndUpdate({_id:id},{name:`${name}`,sold:sold,image:`${image}`})
            const data = { id:id,name:name,sold:sold,image:image};
            return data;
        },
        deleteBook:async(parent,args)=>{
            console.log(args);
            const delet = await BookModel.findByIdAndDelete(args);
            const id = args._id;
            const data = { id:id,delete:"This is has been deleted" }; 
            return data;
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// added this line to awa server start

server.start().then(()=>{
server.applyMiddleware({app}); 


}).catch((err)=>{console.log(err)});


app.listen(3000,()=>console.log('the server is running on the port 3000'));
