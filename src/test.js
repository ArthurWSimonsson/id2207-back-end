const app = require("./index");
const mongoose = require("mongoose");
const supertest = require("supertest");

const InitialRequest = require('./model/initialRequest');
const Task = require('./model/task');
const RecruitmentRequest = require('./model/recruitmentRequest');
const FinancialRequest = require('./model/financialRequest');

const auth = require("./middleware/auth");
const { test } = require("@jest/globals");
const database = require('./config/database');

const { MONGO_URI } = process.env;
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjE2YjA5NzliMDIwN2QzZjE3Zjg5ZGYxIiwicm9sZSI6IkN1c3RvbWVyT2ZmaWNlciIsImlhdCI6MTYzNDQ3MDQ2NH0.y4W5LAd5GNffwHmIN36gu8sw8H4MHgw6H545mrDAdRM';

beforeAll((done) => {  
    mongoose
        .connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
        },() => done());
});

test("POST /initialRequest", async () => {
    const request = await InitialRequest.findOneAndDelete({
        recordNumber: 'test'});

    await supertest(app)
    .post('/initialRequest')
    .set('x-access-token',token)
    .send({
    recordNumber: 'test',
    clientName: 'test',
    eventType: 'test',
    attendees: 1,
    budget: 'test',
    decorations: false,
    parties: true,
    photos: true,
    food: false,
    drinks: false,
    currentResponsible: 'test'
    })
    .expect(200)
    .then((response) => {
            expect(response.body).toBeTruthy();
      })
  });
  
test('POST without access token', async () => {
    await supertest(app)
    .post('/initialRequest')
    .send({
    recordNumber: 'test',
    clientName: 'test',
    eventType: 'test',
    attendees: 1,
    budget: 'test',
    decorations: false,
    parties: true,
    photos: true,
    food: false,
    drinks: false,
    currentResponsible: 'test'
    })
    .expect(403)
})

test('POST /initialRequest should fail with already used record number', async () => {
    await supertest(app)
    .post('/initialRequest')
    .set('x-access-token',token)
    .send({
    recordNumber: 'test',
    clientName: 'test',
    eventType: 'test',
    attendees: 1,
    budget: 'test',
    decorations: false,
    parties: true,
    photos: true,
    food: false,
    drinks: false,
    currentResponsible: 'test'
    })
    .expect(409)
});

test('GET /initialRequestList', async () => {
    await supertest(app)
    .get('/initialRequestList')
    .set('x-access-token',token)
    .expect(200)
});

test('POST /updateInitialRequest', async () => {
    const request = await InitialRequest.findOne({
        recordNumber: 'test'});
    request.clientName = 'new';

    await supertest(app)
    .post('/updateInitialRequest')
    .set('x-access-token',token)
    .send(request)
    .expect(200)
});

test('POST /deleteInitialRequest', async () => {
    await supertest(app)
    .post('/deleteInitialRequest')
    .set('x-access-token',token)
    .send({recordNumber: 'test'})
    .expect(200);
});

test('POST /storeTask', async () => {
    await supertest(app)
    .post('/storeTask')
    .set('x-access-token',token)
    .send({
        recordNumber:'test',
        description:'test',
        assignee:'test',
        priority:'test',
        department:'test',
      })
    .expect(200);

    Task.findOneAndDelete({recordNumber:'test'})
})

test('GET /taskList', async () => {
    await supertest(app)
    .get('/taskList')
    .set('x-access-token',token)
    .expect(200);
})

test('POST /addNoteTask', async () => {
    const task = await Task.findOne({recordNumber:'test'})
    await supertest(app)
    .post('/addNoteTask')
    .set('x-access-token',token)
    .send({id:task._id, note:'test'})
    .expect(200)
})

test('POST /addRecruitmentRequest', async () => {
    await supertest(app)
    .post('/addRecruitmentRequest')
    .set('x-access-token',token)
    .send({
        duration :'test',
        department: 'test',
        years: 'test',
        title: 'test',
        description: 'test',
        status:'unhandled',
      })
    .expect(200);

    RecruitmentRequest.findOneAndDelete({duration:'test'});
})

test('GET /recruitmentList', async () => {
    await supertest(app)
    .get('/recruitmentList')
    .set('x-access-token', token)
    .expect(200);
})

test('POST /changeRecruitmentStatus', async () => {
    const request = await RecruitmentRequest.findOne({duration:'test'})

    await supertest(app)
    .post('/changeRecruitmentStatus')
    .set('x-access-token', token)
    .send({id: request.id, status : 'test'})
    .expect(201);
})

test('POST /addFinancialRequest', async () => {
    await supertest(app)
    .post('/addFinancialRequest')
    .set('x-access-token', token)
    .send({
        reference : 'test',
        department: 'test',
        amount: 'test',
        reason: 'test',
        status:'unhandled',
      })
    .expect(200)

    await FinancialRequest.findOneAndDelete({reference: 'test'});
})

afterAll((done) => {
    app.close();
    mongoose.connection.close(() => done())
});
