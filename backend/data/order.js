const getDate = (number = 0) => {
    const d = new Date();
    const yy = d.getFullYear();
    const mm = (d.getMonth() + 1 < 10) ? `0${d.getMonth() + 1}` : (d.getMonth() + 1);
    const dd = ((d.getDate() - number) < 10) ? `0${(d.getDate() - number)}` : ((d.getDate() - number));
    const newDate = `${yy}-${mm}-${dd}`;
    return newDate;
};

const products = [
    {
        "qty": 1,
        "price": 30000,
        "discount": 15,
        "product": "62012ca3aae043844a3fb1b3"
    }
];

export const getOrders = () => {
    const datas = [...Array(7).keys()].map((key) => {
        const newDataList = [
            {
                "user": "61e57551c5abcd940f6613e9",
                "orderItems": [
                    {
                        "qty": 1,
                        "price": 150000,
                        "discount": 0,
                        "product": "61ff7600550fd28cacef5d8b",
                    }
                ],
                "shippingAddress": {
                    "phone": 9072767130,
                    "address": "EKNM Gov. polytechnic college trikkaripur",
                    "city": "Payyannur",
                    "postalCode": "670521",
                    "contry": "India"
                },
                "paymentMethod": "COD",
                "itemsPrice": 150000,
                "totalPrice": 150000,
                "isPaid": true,
                "isDelivered": true,
                "isCancelled": false,
            },
            {
                "user": "61e57551c5abcd940f6613e9",
                "orderItems": [
                    {
                        "qty": 1,
                        "price": 30000,
                        "discount": 0,
                        "product": "62012ca3aae043844a3fb1b3"
                    }
                ],
                "shippingAddress": {
                    "phone": 9072767130,
                    "address": "EKNM Gov. polytechnic college trikkaripur",
                    "city": "Payyannur",
                    "postalCode": "670521",
                    "contry": "India"
                },
                "paymentMethod": "COD",
                "itemsPrice": 30000,
                "wallet": 0,
                "totalPrice": 30000,
                "isPaid": true,
                "isDelivered": true,
                "isCancelled": false,
            }
        ];

        const min = 0;
        const max = newDataList.length - 1;
        const newData = newDataList[Math.floor(Math.random() * (max - min + 1) + min)];

        newData.createdAt = new Date(getDate(key));
        newData.paidAt = new Date(getDate(key));
        newData.deliveredAt = new Date(getDate(key));
        newData.updatedAt = new Date(getDate(key));

        return newData;
    });
    return datas;
};