const express = require('express');
const http = require('http');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncRedis = require('async-redis');

const port = '1999';
const address = '127.0.0.1';
const app = express();
const server = http.createServer(app);
const redisClient = asyncRedis.createClient();
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// First middleware to print all incoming requests
app.use((req, res, next) => {
    console.log(`Visited url -> ${req.method}`, req.url);
    next();
});

/**
 * signup
 */
app.post('/signup', async (req, res) => {    
    return res.json({
        message: 'success signup'
    });
});

/**
 * login
 */
app.post('/login', async (req, res) => {    
    return res.json({
        message: 'success login'
    });
});

/**
 * logout
 */
app.post('/logout', async (req, res) => {    
    return res.json({
        message: 'success logout'
    });
});

server.listen(port, address, () => {
    console.log('server started listening at ', port);
});  