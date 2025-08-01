const options_params = [  
    {   "id": 1, 
        "image": "/static/images/Avtopark/1.jpg", 
        "width": "2.1 м", 
        "length": "4.2 м", 
        "height": "2.35 м", 
        "tonnage": "1.5 т", 
        "palets": "8 шт", 
        "name": "Фура 20 т (борт)",
        "priceNoVAT": 8000, 
        "priceWithVAT": 9600, 
        "minTime": 4, 
        "pricePerKm": 50,
        "hourlyRateNoVAT": 1000, 
        "hourlyRateWithVAT": 1200,
        "loadingPrices": {
            "noVAT": {"Задняя": 0, "Боковая": 1000, "Верхняя": 1000},
            "withVAT": {"Задняя": 0, "Боковая": 1200, "Верхняя": 1200}
        },
        "unloadingPrices": {
            "noVAT": {"Задняя": 0, "Боковая": 1000, "Верхняя": 1000},
            "withVAT": {"Задняя": 0, "Боковая": 1200, "Верхняя": 1200}
        }
    },
    {   "id": 2, 
        "image": "/static/images/Avtopark/2.jpg", 
        "width": "2.1 м", 
        "length": "4.2 м", 
        "height": "0.4 м", 
        "tonnage": "1.5 т", 
        "palets": "8 шт", 
        "name": "Фура 20 т (борт)",
        "priceNoVAT": 8000, 
        "priceWithVAT": 9600, 
        "minTime": 4,
        "pricePerKm": 45,
        "hourlyRateNoVAT": 500, 
        "hourlyRateWithVAT": 600,
        "loadingPrices": {
            "noVAT": {"Задняя": 0, "Боковая": 800, "Верхняя": 800},
            "withVAT": {"Задняя": 0, "Боковая": 960, "Верхняя": 960}
        },
        "unloadingPrices": {
            "noVAT": {"Задняя": 0, "Боковая": 800, "Верхняя": 800},
            "withVAT": {"Задняя": 0, "Боковая": 960, "Верхняя": 960}
        }
    },
    {   "id": 3, 
        "image": "/static/images/Avtopark/3.jpg", 
        "width": "2.12 м", 
        "length": "6.2 м", 
        "height": "2.37 м", 
        "tonnage": "2 т", 
        "palets": "12 шт", 
        "name": "Фура 20 т (борт)",
        "priceNoVAT": 10000, 
        "priceWithVAT": 12000, 
        "minTime": 4,
        "pricePerKm": 45,
        "hourlyRateNoVAT": 600, 
        "hourlyRateWithVAT": 720,
        "loadingPrices": {
            "noVAT": {"Задняя": 0, "Боковая": 1000, "Верхняя": 1000},
            "withVAT": {"Задняя": 0, "Боковая": 1200, "Верхняя": 1200}
        },
        "unloadingPrices": {
            "noVAT": {"Задняя": 0, "Боковая": 1000, "Верхняя": 1000},
            "withVAT": {"Задняя": 0, "Боковая": 1200, "Верхняя": 1200}
        }
    },
    {   "id": 4, 
        "image": "/static/images/Avtopark/4.jpg", 
        "width": "2.12 м", 
        "length": "6.2 м", 
        "height": "0.4 м", 
        "tonnage": "2 т", 
        "palets": "12 шт", 
        "name": "Фура 20 т (борт)",
        "priceNoVAT": 10000, 
        "priceWithVAT": 12000, 
        "minTime": 4,
        "pricePerKm": 45,
        "hourlyRateNoVAT": 600, 
        "hourlyRateWithVAT": 720,
        "loadingPrices": {
            "noVAT": {"Задняя": 0, "Боковая": 1000, "Верхняя": 1000},
            "withVAT": {"Задняя": 0, "Боковая": 1200, "Верхняя": 1200}
        },
        "unloadingPrices": {
            "noVAT": {"Задняя": 0, "Боковая": 1000, "Верхняя": 1000},
            "withVAT": {"Задняя": 0, "Боковая": 1200, "Верхняя": 1200}
        }
    },
    {   "id": 5, 
        "image": "/static/images/Avtopark/5.jpg", 
        "width": "2.47 м", 
        "length": "6.2 м", 
        "height": "2.37 м", 
        "tonnage": "3 т", 
        "palets": "15 шт", 
        "name": "Фура 20 т (борт)",
        "priceNoVAT": 12000, 
        "priceWithVAT": 14400, 
        "minTime": 6,
        "pricePerKm": 45,
        "hourlyRateNoVAT": 700,
        "hourlyRateWithVAT": 840,
        "loadingPrices": {
            "noVAT": {"Задняя": 0, "Боковая": 1200, "Верхняя": 1200},
            "withVAT": {"Задняя": 0, "Боковая": 1440, "Верхняя": 1440}
        },
        "unloadingPrices": {
            "noVAT": {"Задняя": 0, "Боковая": 1200, "Верхняя": 1200},
            "withVAT": {"Задняя": 0, "Боковая": 1440, "Верхняя": 1440}
        }
    },
    {   "id": 6, 
        "image": "/static/images/Avtopark/6.jpeg", 
        "width": "2.47 м", 
        "length": "6.2 м", 
        "height": "0.5 м", 
        "tonnage": "3 т", 
        "palets": "15 шт", 
        "name": "Фура 20 т (борт)",
        "priceNoVAT": 12000, 
        "priceWithVAT": 14400, 
        "minTime": 6,
        "pricePerKm": 45,
        "hourlyRateNoVAT": 700, 
        "hourlyRateWithVAT": 840,
        "loadingPrices": {
            "noVAT": {"Задняя": 0, "Боковая": 1200, "Верхняя": 1200},
            "withVAT": {"Задняя": 0, "Боковая": 1440, "Верхняя": 1440}
        },
        "unloadingPrices": {
            "noVAT": {"Задняя": 0, "Боковая": 1200, "Верхняя": 1200},
            "withVAT": {"Задняя": 0, "Боковая": 1440, "Верхняя": 1440}
        }
    },
    {   "id": 7, 
        "image": "/static/images/Avtopark/7.jpg", 
        "width": "2.47 м", 
        "length": "7.4 м", 
        "height": "2.75 м", 
        "tonnage": "5 т", 
        "palets": "18 шт", 
        "name": "Фура 20 т (борт)",
        "priceNoVAT": 15000, 
        "priceWithVAT": 18000, 
        "minTime": 6,
        "pricePerKm": 45,
        "hourlyRateNoVAT": 800, 
        "hourlyRateWithVAT": 960,
        "loadingPrices": {
            "noVAT": {"Задняя": 0, "Боковая": 1500, "Верхняя": 1500},
            "withVAT": {"Задняя": 0, "Боковая": 1800, "Верхняя": 1800}
        },
        "unloadingPrices": {
            "noVAT": {"Задняя": 0, "Боковая": 1500, "Верхняя": 1500},
            "withVAT": {"Задняя": 0, "Боковая": 1800, "Верхняя": 1800}
        }
    },
    {   "id": 8, 
        "image": "/static/images/Avtopark/8.jpg", 
        "width": "2.47 м", 
        "length": "7.4 м", 
        "height": "0.5 м", 
        "tonnage": "5 т", 
        "palets": "18 шт", 
        "name": "Фура 20 т (борт)",
        "priceNoVAT": 15000, 
        "priceWithVAT": 18000, 
        "minTime": 6,
        "pricePerKm": 45,
        "hourlyRateNoVAT": 800, 
        "hourlyRateWithVAT": 960,
        "loadingPrices": {
            "noVAT": {"Задняя": 0, "Боковая": 1500, "Верхняя": 1500},
            "withVAT": {"Задняя": 0, "Боковая": 1800, "Верхняя": 1800}
        },
        "unloadingPrices": {
            "noVAT": {"Задняя": 0, "Боковая": 1500, "Верхняя": 1500},
            "withVAT": {"Задняя": 0, "Боковая": 1800, "Верхняя": 1800}
        }
    },
    {   "id": 9, 
        "image": "/static/images/Avtopark/9.jpg", 
        "width": "2.47 м", 
        "length": "6.2 м", 
        "height": "2.5 м", 
        "tonnage": "10 т", 
        "palets": "15 шт", 
        "name": "Фура 20 т (борт)",
        "priceNoVAT": 18000, 
        "priceWithVAT": 21600, 
        "minTime": 6,
        "pricePerKm": 45,
        "hourlyRateNoVAT": 900, 
        "hourlyRateWithVAT": 1080,
        "loadingPrices": {
            "noVAT": {"Задняя": 0, "Боковая": 1800, "Верхняя": 1800},
            "withVAT": {"Задняя": 0, "Боковая": 2160, "Верхняя": 2160}
        },
        "unloadingPrices": {
            "noVAT": {"Задняя": 0, "Боковая": 1800, "Верхняя": 1800},
            "withVAT": {"Задняя": 0, "Боковая": 2160, "Верхняя": 2160}
        }
    },
    {   "id": 10, 
        "image": "/static/images/Avtopark/10.jpg", 
        "width": "2.47 м", 
        "length": "6.2 м", 
        "height": "0.5 м", 
        "tonnage": "10 т ", 
        "palets": "15 шт", 
        "name": "Фура 20 т (борт)",
        "priceNoVAT": 18000, 
        "priceWithVAT": 21600, 
        "minTime": 6,
        "pricePerKm": 45,
        "hourlyRateNoVAT": 900, 
        "hourlyRateWithVAT": 720,
        "loadingPrices": {
            "noVAT": {"Задняя": 0, "Боковая": 1800, "Верхняя": 1800},
            "withVAT": {"Задняя": 0, "Боковая": 2160, "Верхняя": 2160}
        },
        "unloadingPrices": {
            "noVAT": {"Задняя": 0, "Боковая": 1800, "Верхняя": 1800},
            "withVAT": {"Задняя": 0, "Боковая": 2160, "Верхняя": 2160}
        }
    },
    {   "id": 11, 
        "image": "/static/images/Avtopark/11.jpg", 
        "width": "2.47 м", 
        "length": "13.6 м", 
        "height": "2.5 м", 
        "tonnage": "20 т", 
        "palets": "33 шт", 
        "name": "Фура 20 т (борт)",
        "priceNoVAT": 25000, 
        "priceWithVAT": 30000, 
        "minTime": 6,
        "pricePerKm": 45,
        "hourlyRateNoVAT": 1000, 
        "hourlyRateWithVAT": 1200,
        "loadingPrices": {
            "noVAT": {"Задняя": 0, "Боковая": 2500, "Верхняя": 2500},
            "withVAT": {"Задняя": 0, "Боковая": 3000, "Верхняя": 3000}
        },
        "unloadingPrices": {
            "noVAT": {"Задняя": 0, "Боковая": 2500, "Верхняя": 2500},
            "withVAT": {"Задняя": 0, "Боковая": 3000, "Верхняя": 3000}
        }
    },
    {   "id": 12, 
        "image": "/static/images/Avtopark/12.jpg", 
        "width": "2.47 м", 
        "length": "13.6 м", 
        "height": "0.5 м", 
        "tonnage": "20 т", 
        "palets": "33 шт", 
        "name": "Фура 20 т (борт)",
        "priceNoVAT": 25000, 
        "priceWithVAT": 30000, 
        "minTime": 6,
        "pricePerKm": 45,
        "hourlyRateNoVAT": 1000, 
        "hourlyRateWithVAT": 1200,
        "loadingPrices": {
            "noVAT": {"Задняя": 0, "Боковая": 2500, "Верхняя": 2500},
            "withVAT": {"Задняя": 0, "Боковая": 3000, "Верхняя": 3000}
        },
        "unloadingPrices": {
            "noVAT": {"Задняя": 0, "Боковая": 2500, "Верхняя": 2500},
            "withVAT": {"Задняя": 0, "Боковая": 3000, "Верхняя": 3000}
        }
    }
];


const special_tech_params = [
    {
        "id": 101, 
        "image": "/static/images/Avtospec/13.jpg", 
        "length": "5.5 м", 
        "width": "2.5 м", 
        "height": "3.2 м", 
        "tonnage": "8 т", 
        "boom_length": "14 м", 
        "boom_tonnage": "3.5 т", 
        "priceNoVAT": 20000, 
        "priceWithVAT": 24000, 
        "minTime": 6, 
        "pricePerKm": 60,
        "hourlyRateNoVAT": 1000, 
        "hourlyRateWithVAT": 1200,
        "showDimensions": true,
        "name": "Фура 20 т (борт)",
    },
    {
        "id": 102, 
        "image": "/static/images/Avtospec/14.jpg", 
        "length": "6.0 м", 
        "width": "2.6 м", 
        "height": "3.5 м", 
        "tonnage": "10 т", 
        "boom_length": "16 м", 
        "boom_tonnage": "4 т", 
        "priceNoVAT": 22000, 
        "priceWithVAT": 26400, 
        "minTime": 6, 
        "pricePerKm": 65,
        "hourlyRateNoVAT": 1100, 
        "hourlyRateWithVAT": 1320,
        "showDimensions": true ,
        "name": "Фура 20 т (борт)",
    },
    {
        "id": 103, 
        "image": "/static/images/Avtospec/15.jpg", 
        "boom_length": "18 м", 
        "boom_tonnage": "5 т", 
        "priceNoVAT": 24000, 
        "priceWithVAT": 28800, 
        "minTime": 6, 
        "pricePerKm": 70,
        "hourlyRateNoVAT": 1200, 
        "hourlyRateWithVAT": 1440,
        "showDimensions": false ,
        "name": "Фура 20 т (борт)",

    },

    {   "id": 104, 
        "image": "/static/images/Avtospec/16.jpg", 
        "boom_length": "20 м", 
        "boom_tonnage": "6 т", 
        "priceNoVAT": 26000, 
        "priceWithVAT": 31200, 
        "minTime": 6, 
        "pricePerKm": 75,
        "hourlyRateNoVAT": 1300, 
        "hourlyRateWithVAT": 1560,
        "showDimensions": false , 
        "name": "Фура 20 т (борт)",
    },
    {   "id": 105, 
        "image": "/static/images/Avtospec/17.jpg", 
        "boom_length": "22 м", 
        "boom_tonnage": "7 т",
        "priceNoVAT": 28000, 
        "priceWithVAT": 33600, 
        "minTime": 6, 
        "pricePerKm": 80,
        "hourlyRateNoVAT": 1400, 
        "hourlyRateWithVAT": 1680,
        "showDimensions": false, 
        "name": "Фура 20 т (борт)",
    },
    {   "id": 106, 
        "image": "/static/images/Avtospec/18.jpg", 
        "length": "7.2 м", 
        "width": "2.8 м", 
        "height": "3.8 м", 
        "tonnage": "15 т", 
        "priceNoVAT": 30000, 
        "priceWithVAT": 36000, 
        "minTime": 6, 
        "pricePerKm": 85,
        "hourlyRateNoVAT": 1500, 
        "hourlyRateWithVAT": 1800,
        "showDimensions": true, 
        "name": "Фура 20 т (борт)",
    }
];


const loaders_params = [
    {   "id": 201, 
        "image": "/static/images/Grus/19.jpg", 
        "title": "Грузчики",
        "description": "Профессиональные грузчики для погрузочно-разгрузочных работ",
        "priceNoVAT": 4000, 
        "priceWithVAT": 4800, 
        "minTime": 1,
        "pricePerLoader": 4000},

    {   "id": 202, 
        "image": "/static/images/Grus/20.jpg", 
        "title": "Такелажные работы","description": "Квалифицированные такелажники для сложных грузов",
        "priceNoVAT": null, }
];                   
