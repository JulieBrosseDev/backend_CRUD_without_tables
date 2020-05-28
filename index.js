const express = require('express');
const app = express();
const Joi = require('joi')
app.use(express.json());

const courses = [
    {id: 1, name: 'course 1'},
    {id: 2, name: 'course 2'},
    {id: 3, name: 'course 3'}
]
app.get('/', (req, res) => {
    res.send('hello world');
})

app.get('/api/courses', (req, res) => {
    res.send(courses);
})



app.get('/api/courses/:id/:year', (req, res) => {
    const course = courses.find(course => parseInt(req.params.id) === course.id)
    if (!course) res.status(404).send('The course with the given id was not found')
    res.send(course);
})

app.post('/api/courses', (req, res) => {
    // option with joi to check validation 
    const {error} =  validateCourse(req.body);
//if(result.error) {
    if(error) {
    res.status(400).send(result.error.details[0].message)
    return;
    }

    // --- end of validation with joi

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res)  => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send('The course with the given id was not found')
        //const result = validateCourse(req.body);
        const {error} =  validateCourse(req.body);
//if(result.error) {
    if(error) {
    res.status(400).send(error.details[0].message)
    return;
}
course.name = req.body.name;
res.send(course)
})

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send('The course with the given id was not found')
    const index = courses.indexOf(course);
    // WE DELETE ONLY ONE OBJECT ('1') FROM THE COURSES ARRAY, THE ONE AT THE RIGHT 'INDEX'
    courses.splice(index, 1)
    res.send(course)
});


function validateCourse(course) {
    const schema ={
        name: Joi.string().min(3).required()
    }
    return Joi.validate(course, schema)
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`))
