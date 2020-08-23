const mongoose = require('mongoose')

let password = ""
let nameArg = ""
let numberArg = ""
let url = ""
let addPerson = false

if(process.argv.length < 3) {
    console.log('Please provide arguments in either format: \n node mongo.js <password> \n node mongo.js <password> <name> <number>')
    process.exit(1)
}
else {
    password = process.argv[2]
    addPerson = false
}

if(process.argv.length >= 5) {
    nameArg = process.argv[3]
    numberArg = process.argv[4]
    addPerson = true
}

url = `mongodb+srv://fullstack:${password}@cluster0.nqi1k.azure.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if(addPerson){
    const person = new Person({
        name: nameArg,
        number: numberArg
    })
    
    person
        .save()
        .then(result => {
            console.log(`added ${nameArg} number ${numberArg} to phonebook`)
            mongoose.connection.close()
        })
}
else {
    Person
        .find({})
        .then(result => {
            result.forEach(
                person => console.log(person)
            )
            mongoose.connection.close()
        })
}
