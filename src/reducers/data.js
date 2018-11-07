export  const Units = [
    {id: 56, type: 'Dbl',name: 'Unit name 1'},
    {id: 182,type: 'Dbl',name: 'Unit name 2'},
    {id: 129,type: 'Dbl',name: 'Unit name 3'},
    {id: 1452,type: 'Fam',name: 'Unit name 4'},
    {id: 872,type: 'Fam',name: 'Unit name 5'},
    {id: 812,type: 'Fam',name: 'Unit name 6'}
]

export  const UnitRateStandard = {
        midWeek: {
            rateValue: 150,
            singleRateValue: 0,
            extraAdult: 10,
            extraChild: 20,
            extraBaby: 0

        },
        endWeek: {
            rateValue: 200,
            singleRateValue: 0,
            extraAdult: 20,
            extraChild: 25,
            extraBaby: 0
        }

}

export  const UnitDiscount = {
              discount: 10
}

    export  const Specialrates = {
        total: 1,
        list: [
            {
                id: 1,
                title: 'Shavot',
                dateFrom: "2018-03-28",
                dateTo:"2018-04-10",
                rateValue: 200,
                singleRateValue: 0,
                extraAdult: 10,
                extraChild: 20,
                extraBaby: 0
            }
            ]
}



export const UnitsFromTo = {
    units: [
        {
            id: 56,
            name: "unit Name 1",
            days: [{
                date: "2018/03/26",
                dateYear: '2018',
                dateMonth: '03',
                dateDay: '26',
                isLocked: false,
                isClosed: false,
                isSpecialRate: false,
                specialRateId: null,
                isReserved: false,
                confirmedOffline: false,
                by: false,
                reservationId: null,
                isWeekend: false,
                minimumStay: 1,
                totalPrice: 180
            },{
                date: "2018/03/25",
                dateYear: '2018',
                dateMonth: '03',
                dateDay: '25',
                isLocked: true,
                isClosed: false,
                isSpecialRate: false,
                specialRateId: null,
                isReserved: false,
                confirmedOffline: false,
                by: false,
                reservationId: null,
                isWeekend: false,
                minimumStay: 1,
                totalPrice: 180
            }, {
                date: "2018/03/29",
                dateYear: '2018',
                dateMonth: '03',
                dateDay: '29',
                isLocked: false,
                isClosed: true,
                isSpecialRate: false,
                specialRateId: null,
                isReserved: false,
                confirmedOffline: false,
                reservationId: null,
                isWeekend: false,
                minimumStay: 5,
                totalPrice: 190
            }, {
                date: "2018/04/08",
                dateYear: '2018',
                dateMonth: '04',
                dateDay: '08',
                isLocked: false,
                isClosed: false,
                isSpecialRate: false,
                specialRateId: null,
                isReserved: true,
                confirmedOffline: false,
                reservationId: null,
                isWeekend: false,
                minimumStay: 12,
                totalPrice: 1900
            }
            ]

        },{
            id: 129,
            name: "unit Name 3",
            days: [{
                date: "2018/04/08",
                dateYear: '2018',
                dateMonth: '04',
                dateDay: '08',
                isLocked: false,
                isClosed: false,
                isSpecialRate: false,
                specialRateId: null,
                isReserved: false,
                confirmedOffline: false,
                reservationId: null,
                isWeekend: true,
                minimumStay: 2,
                totalPrice: 240
            }, {
                date: "2018/04/10",
                dateYear: '2018',
                dateMonth: '04',
                dateDay: '10',
                isLocked: false,
                isClosed: false,
                isSpecialRate: false,
                specialRateId: null,
                isReserved: true,
                confirmedOffline: false,
                reservationId: null,
                isWeekend: false,
                minimumStay: 7,
                totalPrice: 260
            }, {
                date: "2018/04/01",
                dateYear: '2018',
                dateMonth: '04',
                dateDay: '01',
                isLocked: false,
                isClosed: false,
                isSpecialRate: false,
                specialRateId: null,
                isReserved: true,
                confirmedOffline: false,
                reservationId: null,
                isWeekend: false,
                minimumStay: 5,
                totalPrice: 260
            }
            ]

        }

    ]
}
