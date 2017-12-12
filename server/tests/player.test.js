const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
const moment = require('moment');

const { app } = require('./../server');
const { Player } = require('./../models/player');

const players = [{
    _id: new ObjectID(),
    name: {
        first: 'Tommy',
        middle: 'Joseph',
        last: 'Treb',
        nickname: 'Two Gloves'
    },
    address: {
        street: '2107 S Washington Ave',
        city: 'Marshfield',
        state: 'WI',
        zipCode: '54449'
    },
    birthdate: moment('5/23/1992', 'MM-DD-YYYY').valueOf(),
    phones: {
        home: {
            isPrimary: true,
            number: '7153211583'
        },
        cell: {
            isPrimary: false,
            number: ''
        },
        work: {
            isPrimary: false,
            ext: '',
            number: ''
        }
    },
    email: 'tomtrezb2003@gmail.com',
    employment: {
        place: 'MCIS',
        occupation: 'Programmer'
    },
    gender: 'Male',
    legalStatus: 'Single',
    previousPlay: {
        havePlayedBefore: true,
        location: 'Wisconsin Rapids',
        lastYearOfPlay: '2017',
        lastSkillLevel: '7'
    },
    friendInterested: {
        name: {
            first: '',
            last: '',
            nickname: ''
        },
        phone: ''
    }
}, {
    _id: new ObjectID(),
    name: {
        first: 'Tommy',
        middle: 'Joseph',
        last: 'Treb',
        nickname: 'Two Gloves'
    },
    address: {
        street: '2107 S Washington Ave',
        city: 'Marshfield',
        state: 'WI',
        zipCode: '54449'
    },
    birthdate: moment('5/23/1992', 'MM-DD-YYYY').valueOf(),
    phones: {
        home: {
            isPrimary: true,
            number: '7153211583'
        },
        cell: {
            isPrimary: false,
            number: ''
        },
        work: {
            isPrimary: false,
            ext: '',
            number: ''
        }
    },
    email: 'jeanna.j.diedrich@gmail.com',
    employment: {
        place: 'MCIS',
        occupation: 'Programmer'
    },
    gender: 'Male',
    legalStatus: 'Single',
    previousPlay: {
        havePlayedBefore: true,
        location: 'Wisconsin Rapids',
        lastYearOfPlay: '2017',
        lastSkillLevel: '7'
    },
    friendInterested: {
        name: {
            first: '',
            last: '',
            nickname: ''
        },
        phone: ''
    }
}, {
    _id: new ObjectID(),
    name: {
        first: 'Tommy',
        middle: 'Joseph',
        last: 'Treb',
        nickname: 'Two Gloves'
    },
    address: {
        street: '2107 S Washington Ave',
        city: 'Marshfield',
        state: 'WI',
        zipCode: '54449'
    },
    birthdate: moment('5/23/1992', 'MM-DD-YYYY').valueOf(),
    phones: {
        home: {
            isPrimary: true,
            number: '7153211583'
        },
        cell: {
            isPrimary: false,
            number: ''
        },
        work: {
            isPrimary: false,
            ext: '',
            number: ''
        }
    },
    email: 'tommy@playfree.io',
    employment: {
        place: 'MCIS',
        occupation: 'Programmer'
    },
    gender: 'Male',
    legalStatus: 'Single',
    previousPlay: {
        havePlayedBefore: true,
        location: 'Wisconsin Rapids',
        lastYearOfPlay: '2017',
        lastSkillLevel: '7'
    },
    friendInterested: {
        name: {
            first: '',
            last: '',
            nickname: ''
        },
        phone: ''
    }
}];

let newPlayer;

beforeEach((done) => {
    var asyncCount = 0;

    asyncCount++;
    Player.remove({}).then(() => {
        Player.insertMany(players);
        asyncCount--;
        if (asyncCount === 0) {
            done();
        }
    });

    newPlayer = {
        name: {
            first: 'New',
            middle: 'F',
            last: 'Guy',
            nickname: 'Smokey'
        },
        address: {
            street: '101 N lawl Ave',
            city: 'Uberville',
            state: 'FL',
            zipCode: '54469'
        },
        birthdate: moment('5/23/1998', 'MM-DD-YYYY').valueOf(),
        phones: {
            home: {
                isPrimary: true,
                number: '7153211583'
            },
            cell: {
                isPrimary: false,
                number: ''
            },
            work: {
                isPrimary: false,
                ext: '',
                number: ''
            }
        },
        email: 'tommytreb@gmail.com',
        employment: {
            place: 'MCIS',
            occupation: 'Programmer'
        },
        gender: 'Male',
        legalStatus: 'Single',
        previousPlay: {
            havePlayedBefore: true,
            location: 'Wisconsin Rapids',
            lastYearOfPlay: '2017',
            lastSkillLevel: '7'
        },
        friendInterested: {
            name: {
                first: '',
                last: '',
                nickname: ''
            },
            phone: ''
        }
    };
});

describe('POST /player', () => {
    it('should create a new player', async () => {
        // Test post succeeds
        const response = await request(app).post('/player').send({ ...newPlayer });
        expect(response.status).toBe(200);

        // Test seeded 3 players and this one are the only ones that exist
        const allPlayers = await Player.find();
        expect(allPlayers.length).toBe(4);
    });

    it('should not create a new player with empty body data', async () => {
        // Test post fails
        const response = await request(app).post('/player').send({});
        expect(response.status).toBe(400);

        // Test seeded 3 players are the only ones that exist
        const allPlayers = await Player.find();
        expect(allPlayers.length).toBe(3);
    });

    it('should not create a new player with invalid birthdate (less than 12 years old)', async () => {
        newPlayer = {
            ...newPlayer,
            birthdate: moment().valueOf()
        };

        const response = await request(app).post('/player').send({ ...newPlayer });
        expect(response.status).toBe(400);
    });

    it('should create a new player with a valid birthdate (at least 12 years old)', async() => {
        newPlayer = {
            ...newPlayer,
            birthdate: moment().subtract(12, 'years').subtract('1', day)
        };

        const response = await request(app).post('/player').send({ ...newPlayer });
        expect(response.status).toBe(200);
    });
});

// describe('GET /todos', () => {
//     it('should get all todos', (done) => {
//         request(app)
//             .get('/todos')
//             .expect(200)
//             .expect((res) => {
//                 expect(res.body.todos.length).toBe(2);
//             })
//             .end(done);
//     });
// });

// describe('GET /todos/:id', () => {
//     it('should get todo by id', (done) => {
//         var expected = todos[0];
//         request(app)
//             .get(`/todos/${expected._id}`)
//             .expect(200)
//             .expect((res) => {
//                 expect(res.body.todo.text).toBe(expected.text);
//                 expect(res.body.todo).toInclude(expected);
//             })
//             .end(done);
//     });

//     it('should return 404 if todo not found', (done) => {
//         request(app)
//             .get(`/todos/${new ObjectID().toHexString()}`)
//             .expect(404)
//             .end(done);
//     });

//     it('should return 404 for non-object ids', (done) => {
//         request(app)
//             .get('/todos/123')
//             .expect(404)
//             .end(done);
//     });
// });

// describe('REMOVE /todos', () => {
//     it('should remove todo by id', (done) => {
//         var expected = todos[0];

//         request(app)
//             .delete(`/todos/${expected._id}`)
//             .expect(200)
//             .expect((res) => {
//             })
//             .end(done);
//     });
// });

// describe('PATCH /todos', () => {
//     it('should update a todo by id', (done) => {
//         var todo = todos[1];
//         var updatedTodo = {
//             'text': 'Updated from the tests!!!',
//             'completed': true
//         };

//         request(app)
//             .patch(`/todos/${todo._id}`)
//             .send(updatedTodo)
//             .expect(200)
//             .expect((res) => {
//                 expect(res.body.todo).toInclude(updatedTodo);
//             })
//             .end(done);
//     });
// });

// describe('POST /users', () => {
//     it('should create a new user', (done) => {
//         var newUser = {
//             'email': 'tommy@playfree.io',
//             'password': 'password01'
//         };

//         request(app)
//             .post('/users')
//             .send(newUser)
//             .expect(200)
//             .expect((res) => {
//                 expect(res.body.newUser).toInclude({ email: newUser.email });
//             })
//             .end(done);
//     });
// });
