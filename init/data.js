const sampleListings = [
    {
        image: [{
            url: "https://cdn.impel.io/swipetospin-viewers/simedarbymalaysia/628241/20240407100806.XXYBGMWJ/closeups/cu-0.jpg",
            filename: "FYP Project",
        }],
        condition: "used",
        carType: "petrol",
        registrationType: "private",
        registrationDate: "04-08-2016",
        registrationNumber: "WXY1234",
        brandModel: "Honda",
        year: 2015,
        mileage: 38000,
        seat: 5,
        color: "White",
        title: "Honda Civic",
        description: "Well-maintained sedan",
        price: 19000,
        location: {
            houseOrRoadName: "Jalan Ampang",
            city: "Kuala Lumpur",
            state: "Selangor",
        },
        geometry: {
            coordinates: [101.7136, 3.1555]
        }

    },

    {
        image: [{
            url: "https://img.rnudah.com/grids/28/2872899624238693451.jpg",
            filename: "Car Project",
        }],
        condition: "new",
        carType: "electric",
        registrationType: "private",
        registrationDate: "10-01-2023",
        registrationNumber: "ABC5678",
        brandModel: "Tesla",
        year: 2023,
        mileage: 100,
        seat: 5,
        color: "Red",
        title: "Tesla Model 3",
        description: "Brand new electric car",
        price: 60000,
        location: {
            houseOrRoadName: "Jalan Bukit Bintang",
            city: "Kuala Lumpur",
            state: "Selangor"
        },
        geometry: {
            coordinates: [101.7092, 3.1485]
        }

    },
    {
        image: [{
            url: "https://cdn.rnudah.com/images/plain/9054fdfa055faa973175386c64dca8f6-2881738488503966270.jpg",
            filename: "Luxury Car",
        }],
        condition: "used",
        carType: "diesel",
        registrationType: "commercial",
        registrationDate: "15-05-2018",
        registrationNumber: "JKL9123",
        brandModel: "BMW",
        year: 2017,
        mileage: 50000,
        seat: 5,
        color: "Black",
        title: "BMW X5",
        description: "Luxury SUV in excellent condition",
        price: 40000,
        location: {
            houseOrRoadName: "Jalan Sultan Ismail",
            city: "Kuala Lumpur",
            state: "Selangor",
        },
        geometry: {
            coordinates: [101.7057, 3.1478]
        }

    },
    {
        image: [{
            url: "https://img.rnudah.com/grids/28/2883507613740395045.jpg",
            filename: "Sporty Car",
        }],
        condition: "used",
        carType: "petrol",
        registrationType: "private",
        registrationDate: "21-07-2019",
        registrationNumber: "XYZ8765",
        brandModel: "Toyota",
        year: 2019,
        mileage: 12000,
        seat: 2,
        color: "Yellow",
        title: "Toyota Supra",
        description: "Sporty car in perfect condition",
        price: 45000,
        location: {
            houseOrRoadName: "Jalan Kuching",
            city: "Kuala Lumpur",
            state: "Selangor",
        },
        geometry: {
            coordinates: [101.6826, 3.1734]
        }

    },

    {
        image: [{
            url: "https://img.rnudah.com/grids/28/2882470251206416091.jpg",
            filename: "Eco Car",
        }],
        condition: "new",
        carType: "hybrid",
        registrationType: "private",
        registrationDate: "05-02-2022",
        registrationNumber: "LMN3456",
        brandModel: "Toyota",
        year: 2022,
        mileage: 200,
        seat: 5,
        color: "Blue",
        title: "Toyota Prius",
        description: "Eco-friendly hybrid car",
        price: 32000,
        location: {
            houseOrRoadName: "Jalan Tun Razak",
            city: "Kuala Lumpur",
            state: "Selangor",
        },
        geometry: {
            coordinates: [101.7139, 3.1579]
        }

    },

    {
        image: [{
            url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR302vyxRlQHVVJ_utMyq_NesABWUmQ510ebw&s",
            filename: "Family Car",
        }],
        condition: "used",
        carType: "petrol",
        registrationType: "private",
        registrationDate: "12-11-2017",
        registrationNumber: "DEF1234",
        brandModel: "Nissan",
        year: 2016,
        mileage: 45000,
        seat: 5,
        color: "Silver",
        title: "Nissan Almera",
        description: "Reliable family sedan",
        price: 15000,
        location: {
            houseOrRoadName: "Jalan Pudu",
            city: "Kuala Lumpur",
            state: "Selangor",
        },
        geometry: {
            coordinates: [101.7080, 3.1390]
        }

    },

    {
        image: [{
            url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT96c2FzjE3KAN7shVqvuvTiKARy7SG18q7Aw&s",
            filename: "Compact Car",
        }],
        condition: "used",
        carType: "diesel",
        registrationType: "private",
        registrationDate: "03-03-2020",
        registrationNumber: "GHI6789",
        brandModel: "Volkswagen",
        year: 2019,
        mileage: 30000,
        seat: 5,
        color: "Grey",
        title: "Volkswagen Golf",
        description: "Compact car with great performance",
        price: 27000,
        location: {
            houseOrRoadName: "Jalan Cheras",
            city: "Kuala Lumpur",
            state: "Selangor",
        },
        geometry: {
            coordinates: [101.7223, 3.1280]
        }

    },

    {
        image: [{
            url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeU2cUTZdP-Vk0zVShVCkKxMWukQuwcR8UHQ&s",
            filename: "SUV Car",
        }],
        condition: "used",
        carType: "petrol",
        registrationType: "commercial",
        registrationDate: "20-06-2018",
        registrationNumber: "JKL3456",
        brandModel: "Mazda",
        year: 2018,
        mileage: 25000,
        seat: 5,
        color: "Red",
        title: "Mazda CX-5",
        description: "Spacious SUV in great condition",
        price: 32000,
        location: {
            houseOrRoadName: "Jalan Ipoh",
            city: "Kuala Lumpur",
            state: "Selangor",
        },
        geometry: {
            coordinates: [101.6822, 3.1868]
        }

    },

    {
        image: [{
            url: "https://img.rnudah.com/grids/28/2879862846809593146.jpg",
            filename: "Convertible Car",
        }],
        condition: "new",
        carType: "petrol",
        registrationType: "private",
        registrationDate: "15-03-2021",
        registrationNumber: "MNO6789",
        brandModel: "BMW",
        year: 2021,
        mileage: 500,
        seat: 2,
        color: "Black",
        title: "BMW Z4",
        description: "Stylish convertible car",
        price: 55000,
        location: {
            houseOrRoadName: "Jalan Raja Chulan",
            city: "Kuala Lumpur",
            state: "Selangor",
        },
        geometry: {
            coordinates: [101.7087, 3.1505]
        }

    },

    {
        image: [{
            url: "https://images.clickdealer.co.uk/vehicles/5176/5176775/large2/119492692.jpg",
            filename: "Luxury Sedan",
        }],
        condition: "used",
        carType: "petrol",
        registrationType: "private",
        registrationDate: "25-12-2019",
        registrationNumber: "PQR9876",
        brandModel: "Mercedes-Benz",
        year: 2019,
        mileage: 18000,
        seat: 5,
        color: "White",
        title: "Mercedes-Benz C-Class",
        description: "Luxury sedan with advanced features",
        price: 45000,
        location: {
            houseOrRoadName: "Jalan Tun Razak",
            city: "Kuala Lumpur",
            state: "Selangor",
        },
        geometry: {
            coordinates: [101.7139, 3.1579]
        }

    },

    {
        image: [{
            url: "https://img.rnudah.com/grids/28/2881478885248329831.jpg",
            filename: "Luxury Car",
        }],
        condition: "used",
        carType: "petrol",
        registrationType: "private",
        registrationDate: "02-09-2018",
        registrationNumber: "STU3456",
        brandModel: "Audi",
        year: 2017,
        mileage: 40000,
        seat: 5,
        color: "Silver",
        title: "Audi A8",
        description: "Luxury car with premium interior",
        price: 60000,
        location: {
            houseOrRoadName: "Jalan Ampang Hilir",
            city: "Kuala Lumpur",
            state: "Selangor",
        },
        geometry: {
            coordinates: [101.7463, 3.1671]
        }

    },
    {
        image: [{
            url: "https://media.autoexpress.co.uk/image/private/s--X-WVjvBW--/f_auto,t_content-image-full-desktop@1/v1610017769/autoexpress/2021/01/Used%20Nissan%20Leaf%20Mk1-9.jpg",
            filename: "Eco Car",
        }],
        condition: "new",
        carType: "electric",
        registrationType: "private",
        registrationDate: "27-06-2023",
        registrationNumber: "BCD7890",
        brandModel: "Nissan",
        year: 2023,
        mileage: 50,
        seat: 5,
        color: "Green",
        title: "Nissan Leaf",
        description: "Electric car with great range",
        price: 48000,
        location: {
            houseOrRoadName: "Jalan Dang Wangi",
            city: "Kuala Lumpur",
            state: "Selangor",
        },
        geometry: {
            coordinates: [101.6984, 3.1568]
        }

    },
    {
        image: [{
            url: "https://static.overfuel.com/dealers/trust-auto/image/2020-ford-mustang-shelby-gt350-heritage-edition-3-1024x640.jpg",
            filename: "Sporty Car",
        }],
        condition: "used",
        carType: "petrol",
        registrationType: "private",
        registrationDate: "22-03-2020",
        registrationNumber: "NOP7890",
        brandModel: "Ford",
        year: 2019,
        mileage: 20000,
        seat: 4,
        color: "Red",
        title: "Ford Mustang",
        description: "Iconic sports car with a powerful engine",
        price: 55000,
        location: {
            houseOrRoadName: "Jalan Semarak",
            city: "Kuala Lumpur",
            state: "Selangor",
        },
        geometry: {
            coordinates: [101.7206, 3.1702]
        }

    },
    {
        image: [{
            url: "https://static.motortrader.com.my/photos/medium/2311/23111500017.jpg?1709165538",
            filename: "Family Car",
        }],
        condition: "used",
        carType: "petrol",
        registrationType: "private",
        registrationDate: "08-10-2018",
        registrationNumber: "BCD2345",
        brandModel: "Hyundai",
        year: 2017,
        mileage: 35000,
        seat: 5,
        color: "Silver",
        title: "Hyundai Elantra",
        description: "Comfortable family sedan",
        price: 18000,
        location: {
            houseOrRoadName: "Jalan Semantan",
            city: "Kuala Lumpur",
            state: "Selangor",
        },
        geometry: {
            coordinates: [101.6471, 3.1486]
        }

    },

    {
        image: [{
            url: "https://cdn1.npcdn.net/images/dbfed84ad708cd44de622d58f5fd731f_1709870135.webp?md5id=c24c77136c211f79d0d2cdfc6662af2e&new_width=1000&new_height=1000&size=max&w=-62170008925&from=jpeg",
            filename: "Luxury Car",
        }],
        condition: "used",
        carType: "petrol",
        registrationType: "private",
        registrationDate: "02-12-2019",
        registrationNumber: "LMN7890",
        brandModel: "Audi",
        year: 2018,
        mileage: 30000,
        seat: 5,
        color: "Black",
        title: "Audi Q7",
        description: "Luxury SUV with advanced technology",
        price: 75000,
        location: {
            houseOrRoadName: "Jalan Duta",
            city: "Kuala Lumpur",
            state: "Selangor",
        },
        geometry: {
            coordinates: [101.6767, 3.1791]
        }

    },
    {
        image: [{
            url: "https://img.rnudah.com/grids/28/2852628992185076228.jpg",
            filename: "Luxury Car",
        }],
        condition: "used",
        carType: "petrol",
        registrationType: "private",
        registrationDate: "10-10-2019",
        registrationNumber: "RST3456",
        brandModel: "BMW",
        year: 2018,
        mileage: 25000,
        seat: 5,
        color: "White",
        title: "BMW X6",
        description: "Luxury SUV with a sporty design",
        price: 80000,
        location: {
            houseOrRoadName: "Jalan Kiara",
            city: "Kuala Lumpur",
            state: "Selangor",
        },
        geometry: {
            coordinates: [101.6596, 3.1665]
        }

    },

    {
        image: [{
            url: "https://www.mercedes-benz.com.my/content/malaysia/en/passengercars/models/saloon/w213-22-2/overview/_jcr_content/root/responsivegrid/simple_stage_copy.component.damq1.3382615127549.jpg/mercedes-benz-e-class-saloon-w213-stage-3840x1707-12-2022.jpg",
            filename: "Luxury Car",
        }],
        condition: "used",
        carType: "petrol",
        registrationType: "private",
        registrationDate: "07-09-2019",
        registrationNumber: "TUV4567",
        brandModel: "Mercedes-Benz",
        year: 2018,
        mileage: 27000,
        seat: 5,
        color: "Black",
        title: "Mercedes-Benz E-Class",
        description: "Luxury sedan with classic design",
        price: 62000,
        location: {
            houseOrRoadName: "Jalan Yap Kwan Seng",
            city: "Kuala Lumpur",
            state: "Selangor",
        },
        geometry: {
            coordinates: [101.7175, 3.1634]
        }

    },

    {
        image: [{
            url: "https://listings-prod.tcimg.net/listings/21442/83/40/5YJSA1S13EFP54083/75VE33PTCKPJHIC7JONDIUCWRE-cr-540.jpg",
            filename: "Eco Car",
        }],
        condition: "used",
        carType: "electric",
        registrationType: "private",
        registrationDate: "14-05-2020",
        registrationNumber: "BCD6789",
        brandModel: "Tesla",
        year: 2019,
        mileage: 10000,
        seat: 5,
        color: "Black",
        title: "Tesla Model S",
        description: "Luxury electric car with advanced technology",
        price: 105000,
        location: {
            houseOrRoadName: "Jalan Semarak",
            city: "Kuala Lumpur",
            state: "Selangor",
        },
        geometry: {
            coordinates: [101.7206, 3.1702]
        }

    },
    {
        image: [{
            url: "https://imgd.aeplcdn.com/300x225/cw/ucp/stockApiImg/1SWASVA_eb14c18325594d859beaf4a2dae797a8_1_36718130.jpg?q=80",
            filename: "Family Car",
        }],
        condition: "used",
        carType: "petrol",
        registrationType: "private",
        registrationDate: "28-03-2019",
        registrationNumber: "FGH6789",
        brandModel: "Toyota",
        year: 2018,
        mileage: 30000,
        seat: 5,
        color: "Red",
        title: "Toyota Camry",
        description: "Comfortable family sedan with reliable performance",
        price: 32000,
        location: {
            houseOrRoadName: "Jalan Kiara",
            city: "Kuala Lumpur",
            state: "Selangor",
        },
        geometry: {
            coordinates: [101.6596, 3.1665]
        }

    },
    {
        image: [{
            url: "https://media.karousell.com/media/photos/products/2022/10/3/nissan_gtr_r35_cash_buyer_1664779320_559ae015_progressive.jpg",
            filename: "Sporty Car",
        }],
        condition: "used",
        carType: "petrol",
        registrationType: "private",
        registrationDate: "20-12-2020",
        registrationNumber: "LMN2345",
        brandModel: "Nissan",
        year: 2019,
        mileage: 18000,
        seat: 2,
        color: "Red",
        title: "Nissan GT-R",
        description: "High-performance sports car with advanced technology",
        price: 125000,
        location: {
            houseOrRoadName: "Jalan Damansara",
            city: "Kuala Lumpur",
            state: "Selangor",
        },
        geometry: {
            coordinates: [101.6544, 3.1528]
        }
    },

    {
        image: [{
            url: "https://img.rnudah.com/grids/28/2883216272664920191.jpg",
            filename: "Sporty Car",
        }],
        condition: "used",
        carType: "petrol",
        registrationType: "private",
        registrationDate: "15-05-2021",
        registrationNumber: "XYZ1234",
        brandModel: "Toyota",
        year: 2020,
        mileage: 12000,
        seat: 2,
        color: "Black",
        title: "Toyota Supra",
        description: "A blend of power, performance, and style",
        price: 95000,
        location: {
            houseOrRoadName: "Jalan Tun Razak",
            city: "Kuala Lumpur",
            state: "Selangor",
        },
        geometry: {
            coordinates: [101.7000, 3.1600]
        }
    },
    {
        image: [{
            url: "https://cdn.rnudah.com/images/plain/82667b6ad1c41a30f46ea5397e0921cc-2880309321746729766.jpg",
            filename: "Sporty Car",
        }],
        condition: "used",
        carType: "petrol",
        registrationType: "private",
        registrationDate: "01-11-2018",
        registrationNumber: "ABC5678",
        brandModel: "Audi",
        year: 2017,
        mileage: 25000,
        seat: 2,
        color: "Blue",
        title: "Audi R8",
        description: "An exquisite sports car with cutting-edge design",
        price: 135000,
        location: {
            houseOrRoadName: "Jalan Ampang",
            city: "Kuala Lumpur",
            state: "Selangor",
        },
        geometry: {
            coordinates: [101.7300, 3.1600]
        }
    },

    {
        image: [{
            url: "https://www.europeanprestige.co.uk/blobs/stock/205/images/eef8e555-03dc-4821-a93e-180b7c7ab766/1j6a4104.jpg?width=2000&height=1333",
            filename: "Sporty Car",
        }],
        condition: "used",
        carType: "petrol",
        registrationType: "private",
        registrationDate: "20-06-2019",
        registrationNumber: "DEF8901",
        brandModel: "BMW",
        year: 2018,
        mileage: 20000,
        seat: 4,
        color: "White",
        title: "BMW M4",
        description: "A perfect blend of luxury and performance",
        price: 110000,
        location: {
            houseOrRoadName: "Jalan Sultan Ismail",
            city: "Kuala Lumpur",
            state: "Selangor",
        },
        geometry: {
            coordinates: [101.7100, 3.1700]
        }
    },

    {
        image: [{
            url: "https://img.rnudah.com/grids/28/2882072320731192663.jpg",
            filename: "Sporty Car",
        }],
        condition: "used",
        carType: "petrol",
        registrationType: "private",
        registrationDate: "05-03-2020",
        registrationNumber: "GHI2345",
        brandModel: "Mercedes",
        year: 2019,
        mileage: 15000,
        seat: 2,
        color: "Silver",
        title: "Mercedes-AMG GT",
        description: "High-performance luxury sports car",
        price: 145000,
        location: {
            houseOrRoadName: "Jalan Bukit Bintang",
            city: "Kuala Lumpur",
            state: "Selangor",
        },
        geometry: {
            coordinates: [101.7050, 3.1450]
        }
    },

    {
        image: [{
            url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMVkQJiDxvO9d0PPGBHuiaI0Jthi8HKUDY6Q&s",
            filename: "Sporty Car",
        }],
        condition: "used",
        carType: "petrol",
        registrationType: "private",
        registrationDate: "05-08-2021",
        registrationNumber: "QRS1234",
        brandModel: "Nissan",
        year: 2020,
        mileage: 9000,
        seat: 2,
        color: "Silver",
        title: "Nissan 370Z",
        description: "Sporty design with powerful performance",
        price: 70000,
        location: {
            houseOrRoadName: "Jalan Tun H.S. Lee",
            city: "Kuala Lumpur",
            state: "Selangor",
        },
        geometry: {
            coordinates: [101.7000, 3.1400]
        }
    },

    {
        image: [{
            url: "https://carsguide-res.cloudinary.com/image/upload/f_auto,fl_lossy,q_auto,t_cg_hero_large/v1/editorial/mazda-rx8-2008-red-%281%29.jpg",
            filename: "Sporty Car",
        }],
        condition: "used",
        carType: "petrol",
        registrationType: "private",
        registrationDate: "20-04-2018",
        registrationNumber: "TUV5678",
        brandModel: "Mazda",
        year: 2017,
        mileage: 30000,
        seat: 4,
        color: "Red",
        title: "Mazda RX-8",
        description: "Unique rotary engine sports car",
        price: 45000,
        location: {
            houseOrRoadName: "Jalan Hang Lekir",
            city: "Kuala Lumpur",
            state: "Selangor",
        },
        geometry: {
            coordinates: [101.7050, 3.1500]
        }
    },
];

module.exports = { data: sampleListings };