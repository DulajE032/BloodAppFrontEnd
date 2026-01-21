const express = require('express');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// API Base URL (your Django backend)
const API_URL = process.env.DJANGO_API_URL || 'http://localhost:8000/api';

// Routes
app.get('/', (req, res) => {
    res.render('index', { 
        title: 'Blood Donor Management System',
        currentPage: 'home'
    });
});

// View all donors
app.get('/donors', async (req, res) => {
    try {
        const { bloodGroup, eligible, city, search } = req.query;
        
        // Build query parameters
        let queryParams = '';
        const params = [];
        
        if (bloodGroup) params.push(`blood_group=${bloodGroup}`);
        if (eligible) params.push(`eligible=${eligible}`);
        if (city) params.push(`city=${city}`);
        if (search) params.push(`search=${search}`);
        
        if (params.length > 0) {
            queryParams = '?' + params.join('&');
        }

        const response = await axios.get(`${API_URL}/donors/${queryParams}`);
        
        res.render('donor-list', {
            title: 'All Donors',
            donors: response.data,
            filters: { bloodGroup, eligible, city, search },
            currentPage: 'donors'
        });
    } catch (error) {
        console.error('Error fetching donors:', error. message);
        res.render('donor-list', {
            title:  'All Donors',
            donors: [],
            error: 'Unable to fetch donors.  Please check your backend connection.',
            filters: {},
            currentPage: 'donors'
        });
    }
});

// View single donor details
app.get('/donors/:id', async (req, res) => {
    try {
        const response = await axios.get(`${API_URL}/donors/${req.params.id}/`);
        
        res.render('donor-detail', {
            title: 'Donor Details',
            donor: response.data,
            currentPage: 'donors'
        });
    } catch (error) {
        console.error('Error fetching donor:', error.message);
        res.status(404).render('donor-detail', {
            title: 'Donor Not Found',
            donor: null,
            error: 'Donor not found or backend connection error.',
            currentPage: 'donors'
        });
    }
});

// API endpoint for AJAX requests (optional)
app.get('/api/donors', async (req, res) => {
    try {
        const response = await axios.get(`${API_URL}/donors/`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch donors' });
    }
});

// Error handling middleware
app.use((req, res) => {
    res.status(404).render('index', {
        title: '404 - Page Not Found',
        error: 'Page not found',
        currentPage:  'error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 Connected to Django API at ${API_URL}`);
});