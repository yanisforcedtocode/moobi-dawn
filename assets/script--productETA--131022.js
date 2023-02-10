"use strict";
// holiday data object
const hkPublicHolidayData = {
    vcalendar: [
        {
            vevent: [
                {
                    dtstart: [
                        "20210101",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20210102",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20210101@1823.gov.hk",
                    summary: "The first day of January"
                },
                {
                    dtstart: [
                        "20210212",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20210213",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20210212@1823.gov.hk",
                    summary: "Lunar New Year’s Day"
                },
                {
                    dtstart: [
                        "20210213",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20210214",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20210213@1823.gov.hk",
                    summary: "The second day of Lunar New Year"
                },
                {
                    dtstart: [
                        "20210215",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20210216",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20210215@1823.gov.hk",
                    summary: "The fourth day of Lunar New Year"
                },
                {
                    dtstart: [
                        "20210402",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20210403",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20210402@1823.gov.hk",
                    summary: "Good Friday"
                },
                {
                    dtstart: [
                        "20210403",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20210404",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20210403@1823.gov.hk",
                    summary: "The day following Good Friday"
                },
                {
                    dtstart: [
                        "20210405",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20210406",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20210405@1823.gov.hk",
                    summary: "The day following Ching Ming Festival"
                },
                {
                    dtstart: [
                        "20210406",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20210407",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20210406@1823.gov.hk",
                    summary: "The day following Easter Monday"
                },
                {
                    dtstart: [
                        "20210501",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20210502",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20210501@1823.gov.hk",
                    summary: "Labour Day"
                },
                {
                    dtstart: [
                        "20210519",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20210520",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20210519@1823.gov.hk",
                    summary: "Birthday of the Buddha"
                },
                {
                    dtstart: [
                        "20210614",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20210615",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20210614@1823.gov.hk",
                    summary: "Tuen Ng Festival"
                },
                {
                    dtstart: [
                        "20210701",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20210702",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20210701@1823.gov.hk",
                    summary: "Hong Kong Special Administrative Region Establishment Day"
                },
                {
                    dtstart: [
                        "20210922",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20210923",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20210922@1823.gov.hk",
                    summary: "The day following the Chinese Mid-Autumn Festival"
                },
                {
                    dtstart: [
                        "20211001",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20211002",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20211001@1823.gov.hk",
                    summary: "National Day"
                },
                {
                    dtstart: [
                        "20211014",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20211015",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20211014@1823.gov.hk",
                    summary: "Chung Yeung Festival"
                },
                {
                    dtstart: [
                        "20211225",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20211226",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20211225@1823.gov.hk",
                    summary: "Christmas Day"
                },
                {
                    dtstart: [
                        "20211227",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20211228",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20211227@1823.gov.hk",
                    summary: "The first weekday after Christmas Day"
                },
                {
                    dtstart: [
                        "20220101",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20220102",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20220101@1823.gov.hk",
                    summary: "The first day of January"
                },
                {
                    dtstart: [
                        "20220201",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20220202",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20220201@1823.gov.hk",
                    summary: "Lunar New Year’s Day"
                },
                {
                    dtstart: [
                        "20220202",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20220203",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20220202@1823.gov.hk",
                    summary: "The second day of Lunar New Year"
                },
                {
                    dtstart: [
                        "20220203",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20220204",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20220203@1823.gov.hk",
                    summary: "The third day of Lunar New Year"
                },
                {
                    dtstart: [
                        "20220405",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20220406",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20220405@1823.gov.hk",
                    summary: "Ching Ming Festival"
                },
                {
                    dtstart: [
                        "20220415",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20220416",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20220415@1823.gov.hk",
                    summary: "Good Friday"
                },
                {
                    dtstart: [
                        "20220416",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20220417",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20220416@1823.gov.hk",
                    summary: "The day following Good Friday"
                },
                {
                    dtstart: [
                        "20220418",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20220419",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20220418@1823.gov.hk",
                    summary: "Easter Monday"
                },
                {
                    dtstart: [
                        "20220502",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20220503",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20220502@1823.gov.hk",
                    summary: "The day following Labour Day"
                },
                {
                    dtstart: [
                        "20220509",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20220510",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20220509@1823.gov.hk",
                    summary: "The day following the Birthday of the Buddha"
                },
                {
                    dtstart: [
                        "20220603",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20220604",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20220603@1823.gov.hk",
                    summary: "Tuen Ng Festival"
                },
                {
                    dtstart: [
                        "20220701",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20220702",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20220701@1823.gov.hk",
                    summary: "Hong Kong Special Administrative Region Establishment Day"
                },
                {
                    dtstart: [
                        "20220912",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20220913",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20220912@1823.gov.hk",
                    summary: "The second day following the Chinese Mid-Autumn Festival"
                },
                {
                    dtstart: [
                        "20221001",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20221002",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20221001@1823.gov.hk",
                    summary: "National Day"
                },
                {
                    dtstart: [
                        "20221004",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20221005",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20221004@1823.gov.hk",
                    summary: "Chung Yeung Festival"
                },
                {
                    dtstart: [
                        "20221226",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20221227",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20221226@1823.gov.hk",
                    summary: "The first weekday after Christmas Day"
                },
                {
                    dtstart: [
                        "20221227",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20221228",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20221227@1823.gov.hk",
                    summary: "The second weekday after Christmas Day"
                },
                {
                    dtstart: [
                        "20230102",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20230103",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20230102@1823.gov.hk",
                    summary: "The day following the first day of January"
                },
                {
                    dtstart: [
                        "20230123",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20230124",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20230123@1823.gov.hk",
                    summary: "The second day of Lunar New Year"
                },
                {
                    dtstart: [
                        "20230124",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20230125",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20230124@1823.gov.hk",
                    summary: "The third day of Lunar New Year"
                },
                {
                    dtstart: [
                        "20230125",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20230126",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20230125@1823.gov.hk",
                    summary: "The fourth day of Lunar New Year"
                },
                {
                    dtstart: [
                        "20230405",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20230406",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20230405@1823.gov.hk",
                    summary: "Ching Ming Festival"
                },
                {
                    dtstart: [
                        "20230407",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20230408",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20230407@1823.gov.hk",
                    summary: "Good Friday"
                },
                {
                    dtstart: [
                        "20230408",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20230409",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20230408@1823.gov.hk",
                    summary: "The day following Good Friday"
                },
                {
                    dtstart: [
                        "20230410",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20230411",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20230410@1823.gov.hk",
                    summary: "Easter Monday"
                },
                {
                    dtstart: [
                        "20230501",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20230502",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20230501@1823.gov.hk",
                    summary: "Labour Day"
                },
                {
                    dtstart: [
                        "20230526",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20230527",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20230526@1823.gov.hk",
                    summary: "The Birthday of the Buddha"
                },
                {
                    dtstart: [
                        "20230622",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20230623",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20230622@1823.gov.hk",
                    summary: "Tuen Ng Festival"
                },
                {
                    dtstart: [
                        "20230701",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20230702",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20230701@1823.gov.hk",
                    summary: "Hong Kong Special Administrative Region Establishment Day"
                },
                {
                    dtstart: [
                        "20230930",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20231001",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20230930@1823.gov.hk",
                    summary: "The day following the Chinese Mid-Autumn Festival"
                },
                {
                    dtstart: [
                        "20231002",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20231003",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20231002@1823.gov.hk",
                    summary: "The day following National Day"
                },
                {
                    dtstart: [
                        "20231023",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20231024",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20231023@1823.gov.hk",
                    summary: "Chung Yeung Festival"
                },
                {
                    dtstart: [
                        "20231225",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20231226",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20231225@1823.gov.hk",
                    summary: "Christmas Day"
                },
                {
                    dtstart: [
                        "20231226",
                        {
                            value: "DATE"
                        }
                    ],
                    dtend: [
                        "20231227",
                        {
                            value: "DATE"
                        }
                    ],
                    transp: "TRANSPARENT",
                    uid: "20231226@1823.gov.hk",
                    summary: "The first weekday after Christmas Day"
                }
            ]
        }
    ]
};
// main class
class CalETA {
    constructor(eta, renderSectionId, countDownInstance, etaThresholdDays, refresh) {
        // checks
        this.checkSatStart = (dateRange, exclude = []) => {
            const checkType = "saturdays";
            let dateCount = dateRange.startDate;
            let checkPositive = false;
            let numberOfPosDays = 0;
            const posDays = [];
            let numberOfDays = (dateRange.endDate - dateRange.startDate) / (this.msPerDay);
            for (let i = 0; i < numberOfDays; i++) {
                dateCount = dateCount + this.msPerDay;
                const date = new Date(dateCount);
                if (date.getDay() === 6 && !exclude.includes(dateCount)) {
                    numberOfPosDays = numberOfPosDays + 1;
                    numberOfDays = numberOfDays + 1;
                    checkPositive = true;
                    posDays.push(dateCount);
                }
            }
            const newDateRange = this.getNewDateRange(dateRange.startDate, numberOfDays);
            return {
                checkPositive, numberOfPosDays, posDays, numberOfDays, newDateRange, checkType
            };
        };
        this.checkSunStart = (dateRange, exclude = []) => {
            const checkType = "sundays";
            let dateCount = dateRange.startDate;
            let checkPositive = false;
            let numberOfPosDays = 0;
            const posDays = [];
            let numberOfDays = (dateRange.endDate - dateRange.startDate) / (this.msPerDay);
            for (let i = 0; i < numberOfDays; i++) {
                dateCount = dateCount + this.msPerDay;
                const date = new Date(dateCount);
                if (date.getDay() === 0 && !exclude.includes(dateCount)) {
                    numberOfPosDays = numberOfPosDays + 1;
                    numberOfDays = numberOfDays + 1;
                    checkPositive = true;
                    posDays.push(dateCount);
                }
            }
            const newDateRange = this.getNewDateRange(dateRange.startDate, numberOfDays);
            return {
                checkPositive, numberOfPosDays, posDays, numberOfDays, newDateRange, checkType
            };
        };
        this.checkHoliaysStart = (dateRange, exclude = []) => {
            const checkType = "holidays";
            let dateCount = dateRange.startDate;
            let checkPositive = false;
            let numberOfPosDays = 0;
            let numberOfDays = (dateRange.endDate - dateRange.startDate) / this.msPerDay;
            const posDays = [];
            for (let i = 0; i < numberOfDays; i++) {
                dateCount = dateCount + this.msPerDay;
                if (this.holidayArr.includes(dateCount) && !exclude.includes(dateCount)) {
                    numberOfPosDays = numberOfPosDays + 1;
                    numberOfDays = numberOfDays + 1;
                    checkPositive = true;
                    posDays.push(dateCount);
                    // console.log('holiday')
                }
            }
            const newDateRange = this.getNewDateRange(dateRange.startDate, numberOfDays);
            return { checkPositive, numberOfPosDays, posDays, numberOfDays, newDateRange, checkType };
        };
        this.checkSatEnd = (dateRange, exclude = []) => {
            const checkType = "saturdays";
            let dateCount = dateRange.startDate;
            let checkPositive = false;
            let numberOfPosDays = 0;
            const posDays = [];
            let numberOfDays = (dateRange.endDate - dateRange.startDate) / (this.msPerDay);
            for (let i = 0; i < numberOfDays; i++) {
                dateCount = dateCount + this.msPerDay;
                const date = new Date(dateCount);
                if (date.getDay() === 6 && !exclude.includes(dateCount)) {
                    numberOfPosDays = numberOfPosDays + 1;
                    numberOfDays = numberOfDays + 1;
                    checkPositive = true;
                    posDays.push(dateCount);
                }
            }
            const newDateRange = this.getNewDateRange(dateRange.startDate, numberOfDays);
            return {
                checkPositive, numberOfPosDays, posDays, numberOfDays, newDateRange, checkType
            };
        };
        this.checkSunEnd = (dateRange, exclude = []) => {
            const checkType = "sundays";
            let dateCount = dateRange.startDate;
            let checkPositive = false;
            let numberOfPosDays = 0;
            const posDays = [];
            let numberOfDays = (dateRange.endDate - dateRange.startDate) / (this.msPerDay);
            for (let i = 0; i < numberOfDays; i++) {
                dateCount = dateCount + this.msPerDay;
                const date = new Date(dateCount);
                if (date.getDay() === 0 && !exclude.includes(dateCount)) {
                    numberOfPosDays = numberOfPosDays + 1;
                    numberOfDays = numberOfDays + 1;
                    checkPositive = true;
                    posDays.push(dateCount);
                    // console.log('sun')
                }
            }
            const newDateRange = this.getNewDateRange(dateRange.startDate, numberOfDays);
            return {
                checkPositive, numberOfPosDays, posDays, numberOfDays, newDateRange, checkType
            };
        };
        this.checkHoliaysEnd = (dateRange, exclude = []) => {
            const checkType = "holidays";
            let dateCount = dateRange.startDate;
            let checkPositive = false;
            let numberOfPosDays = 0;
            let numberOfDays = (dateRange.endDate - dateRange.startDate) / this.msPerDay;
            const posDays = [];
            for (let i = 0; i < numberOfDays; i++) {
                dateCount = dateCount + this.msPerDay;
                if (this.holidayArrWSat.includes(dateCount) && !exclude.includes(dateCount)) {
                    numberOfPosDays = numberOfPosDays + 1;
                    numberOfDays = numberOfDays + 1;
                    checkPositive = true;
                    posDays.push(dateCount);
                    // console.log('holiday')
                }
            }
            const newDateRange = this.getNewDateRange(dateRange.startDate, numberOfDays);
            return { checkPositive, numberOfPosDays, posDays, numberOfDays, newDateRange, checkType };
        };
        // assign variables
        this.msPerDay = 86400000;
        this.renderSectionId = renderSectionId;
        this.etaThresholdDays = etaThresholdDays;
        const bulk = document.getElementById('product-ETA--raw').dataset.bulk;
        this.bulk = ((bulk) => {
            if (bulk !== undefined) {
                if (bulk === "true") {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                this.bulk = false;
                return false;
            }
        })(bulk);
        this.refresh = refresh;
        // Test dates (disable in production)
        // const rawStDate = "Dec 27 2022 00:00:00 GMT+0800"
        // const parsedStart = Date.parse(rawStDate).valueOf()
        // this.today = parsedStart;
        this.countDownInstance = countDownInstance;
        this.vcalendar = hkPublicHolidayData.vcalendar[0].vevent;
        this.holidayArr = this.getholidayArray(this.vcalendar, true, true);
        this.holidayArrWSat = this.getholidayArray(this.vcalendar, false, true);
        this.eta = eta;
        // production this.today
        this.today = Date.parse((new Date(Date.now())).toDateString());
        // console.log(new Date(this.today))
        // init
        if (!this.bulk) {
            // this.renderResult(parsedStart, this.getExtendedRange(parsedStart, this.eta), this.etaThresholdDays, true)
            // test render code
            // this.renderResult(this.today, this.getExtendedRange(this.today, this.eta), this.etaThresholdDays, true)
            // product render code
            this.renderResult(this.today, this.getExtendedRange(countDownInstance.cutOffStartDate, this.eta), this.etaThresholdDays, true);
            if (this.refresh) {
                this.refreshETA(5000);
            }
        }
    }
    // remove Sat and Sun from holidays list
    getholidayArray(holidays, noSatDays, noSunDays) {
        let daysArrayAll = holidays.map((el) => {
            let numberOfDays = 0;
            const daysArray = [];
            const startDate = this.newVCalDate(el.dtstart[0]);
            const endDate = this.newVCalDate(el.dtend[0]);
            const noWeekEnds = noSatDays && noSunDays;
            // console.log(noWeekEnds)
            if (startDate instanceof Date && endDate instanceof Date) {
                numberOfDays = (this.parseDateMS(endDate) - this.parseDateMS(startDate)) / this.msPerDay;
                for (let i = 0; i < numberOfDays; i++) {
                    const ms = this.parseDateMS(startDate) + (i * this.msPerDay);
                    const date = new Date(ms);
                    // filter sunday and saturday
                    if (noWeekEnds && date.getDay() !== 6 && date.getDay() !== 0) {
                        daysArray.push(this.parseDateMS(startDate) + (i * this.msPerDay));
                    }
                    // filter Sat only
                    if (!noWeekEnds && noSatDays && !noSunDays && date.getDay() !== 6) {
                        daysArray.push(this.parseDateMS(startDate) + (i * this.msPerDay));
                    }
                    // filter Sun only
                    if (!noWeekEnds && noSunDays && !noSatDays && date.getDay() !== 0) {
                        daysArray.push(this.parseDateMS(startDate) + (i * this.msPerDay));
                    }
                    // filter nth
                    if (!noWeekEnds && !noSunDays && !noSunDays) {
                        daysArray.push(this.parseDateMS(startDate) + (i * this.msPerDay));
                    }
                }
            }
            return daysArray;
        });
        // return deconstructed array
        const arrayDecon = [];
        daysArrayAll.forEach((el) => {
            el.forEach((el1) => {
                arrayDecon.push(el1);
            });
        });
        return arrayDecon;
    }
    // format
    newVCalDate(vCalDate) {
        if (!/^(\d){8}$/.test(vCalDate))
            return "invalid date";
        const y = parseFloat(vCalDate.slice(0, 4));
        const m = parseFloat(vCalDate.slice(4, 6));
        const d = parseFloat(vCalDate.slice(6, 8));
        const date = new Date(y, m - 1, d);
        return date;
    }
    parseDateMS(date) {
        const ms = date.valueOf();
        return ms;
    }
    getETARange(eta, days) {
        const dateRange = {
            startDate: eta,
            endDate: eta + this.msPerDay * days
        };
        return dateRange;
    }
    getRange(beginDate, days) {
        const starDate = this.parseDateMS(beginDate);
        const endDate = this.parseDateMS(beginDate) + (this.msPerDay * days);
        const dateRange = {
            startDate: starDate,
            endDate: endDate
        };
        return dateRange;
    }
    getNewDateRange(startDate, numberOfDays) {
        const newEndDate = startDate + (numberOfDays * this.msPerDay);
        const newDateRange = {
            startDate: startDate,
            endDate: newEndDate
        };
        return newDateRange;
    }
    // check loop
    loopChecks(checks, eta, days) {
        let dateRange = this.getETARange(eta, days);
        let returnObj = {};
        // store checked days to make an exclude list
        let excludeArr = [];
        // loop checks if checkedPositive
        let loopCount = 1;
        for (let i = 0; i < loopCount; i++) {
            // create a report array
            const checkPosArr = checks.map((el) => {
                return false;
            });
            // loop checks
            checks.forEach((el, ind) => {
                const checkresult = el(dateRange, excludeArr);
                // console.log(checkresult)
                if (checkresult.checkPositive) {
                    dateRange = checkresult.newDateRange;
                    checkresult.posDays.forEach((el_1) => {
                        excludeArr.push(el_1);
                    });
                    checkPosArr[ind] = true;
                }
                returnObj = checkresult;
            });
            // console.log(checkPosArr)
            const checkPositive = !!(checkPosArr.filter((el) => { return el; })).length;
            if (checkPositive) {
                loopCount = loopCount + 1;
            }
        }
        return returnObj;
    }
    // render result
    renderResult(today, extendedRange, threshold, badge) {
        const numberOfDaysDelivery = (extendedRange.end.valueOf() - today) / (this.msPerDay);
        // console.log(numberOfDaysDelivery, new Date(Date.now()).toDateString())
        const target = document.getElementById(this.renderSectionId);
        const formatDate = (date) => {
            const dd = date.getDate();
            const mm = date.getMonth();
            const formated = `${dd}/${mm + 1}`;
            return formated;
        };
        if (numberOfDaysDelivery >= threshold) {
            // console.log('over threshold eta days')
            if (target) {
                target.innerHTML = '';
                if (badge) {
                    const badgeContainer = document.createElement('div');
                    badgeContainer.classList.add('etaBadgeContainer');
                    const badgeIcon = document.createElement('i');
                    badgeIcon.classList.add('fas');
                    badgeIcon.classList.add('fa-shipping-fast');
                    const badgeText = document.createElement('span');
                    badgeText.innerText = '1 至 3 個工作天內寄出';
                    badgeContainer.insertAdjacentElement('beforeend', badgeIcon);
                    badgeContainer.insertAdjacentElement('beforeend', badgeText);
                    // 
                    target.insertAdjacentElement('beforebegin', badgeContainer);
                }
            }
            return;
        }
        if (target) {
            target.innerHTML = '';
            // express delivery badge
            if (badge) {
                const badgeIcon = document.createElement('i');
                badgeIcon.classList.add('fas');
                badgeIcon.classList.add('fa-tachometer-alt');
                target.insertAdjacentElement('beforeend', badgeIcon);
            }
            target.classList.add('etaSection--P');
            const span = document.createElement('span');
            span.innerHTML = `預計送達日期：</br>${formatDate(extendedRange.start)} 至 ${formatDate(extendedRange.end)}`;
            target.insertAdjacentElement('beforeend', span);
        }
    }
    refreshETA(delay) {
        const etaRefreshIntv = setInterval(() => {
            const parsedStart = this.countDownInstance.cutOffStartDate;
            // console.log(parsedStart)
            if (parsedStart > Date.now()) {
                this.renderResult(this.today, this.getExtendedRange(parsedStart, this.eta), this.etaThresholdDays, true);
                clearInterval(etaRefreshIntv);
            }
        }, delay);
    }
    // composition
    getExtendedRange(eta, days) {
        const testsArrStart = [this.checkHoliaysStart, this.checkSatStart, this.checkSunStart];
        const testsArrEnd = [this.checkHoliaysEnd, this.checkSunEnd];
        const checkResult_start = this.loopChecks(testsArrStart, eta, 2);
        const checkResult_end = this.loopChecks(testsArrEnd, checkResult_start.newDateRange.endDate, days);
        // result object
        const result = {
            start: new Date(checkResult_start.newDateRange.endDate),
            end: new Date(checkResult_end.newDateRange.endDate)
        };
        // console.log(result)
        return result;
    }
}
class TimeCountDwn {
    constructor(countDownToHour, countDownToMin, countDownId, enableCountDown) {
        // assign variables
        this.msPerDay = 86400000;
        this.msPerSec = 1000;
        this.countDownToHour = countDownToHour;
        this.countDownTomin = countDownToMin;
        this.countDownId = countDownId;
        this.enableCountDown = enableCountDown;
        if (this.enableCountDown) {
            this.setCountDownIntv(1000, this.getTargetTime.bind(this), this.refreshCountDwn.bind(this));
        }
        this.renderCountDwnSection("product-ETA--raw");
    }
    // countdown mechanism
    getTargetTime() {
        let todaysTarget = new Date(Date.now());
        todaysTarget = new Date(todaysTarget.setHours(this.countDownToHour));
        todaysTarget = new Date(todaysTarget.setMinutes(this.countDownTomin));
        todaysTarget = new Date(todaysTarget.setSeconds(0));
        const nowDate = new Date(Date.now());
        if (nowDate.valueOf() < todaysTarget.valueOf()) {
            return todaysTarget.valueOf();
        }
        else {
            const tmlsTarget = todaysTarget.valueOf() + this.msPerDay;
            return tmlsTarget.valueOf();
        }
    }
    getCountDownTime(targetTime = this.getTargetTime()) {
        const differenceDate = targetTime - Date.now();
        const hours = Math.floor(differenceDate / (this.msPerSec * 60 * 60));
        const minutes = Math.floor((differenceDate - (hours * (this.msPerSec * 60 * 60))) / (this.msPerSec * 60));
        const seconds = Math.floor((differenceDate - (hours * (this.msPerSec * 60 * 60)) - (minutes * (this.msPerSec * 60))) / (this.msPerSec));
        // convert values to 2 digits string
        const convert2Digits = (value) => {
            let string2Digits = '';
            if (JSON.stringify(value).length < 2) {
                string2Digits = '0' + JSON.stringify(value);
            }
            return string2Digits || JSON.stringify(value);
        };
        const countDwnStringObj = {
            hours: convert2Digits(hours),
            minutes: convert2Digits(minutes),
            seconds: convert2Digits(seconds)
        };
        return countDwnStringObj;
    }
    setCountDownIntv(interval, targetTimeFn, refreshFn) {
        const countDownHanlder = () => {
            const currentTargetTime = targetTimeFn();
            const hhmmss = this.getCountDownTime(currentTargetTime);
            refreshFn(hhmmss);
        };
        const countDownIntv = setInterval(countDownHanlder, interval);
    }
    // getter: cutOff time
    get cutOffStartDate() {
        const startDate = Date.parse(new Date(this.getTargetTime()).toDateString());
        return startDate;
    }
    // render
    renderCountDwnSection(targetSectionId) {
        const targetSection = document.getElementById(targetSectionId);
        // section
        const countDownSection = document.createElement('div');
        countDownSection.id = this.countDownId + "--section";
        // container
        const countDownSectionContainer = document.createElement('div');
        countDownSectionContainer.id = this.countDownId + "--container";
        // string
        const countDownTitle = document.createElement('span');
        // countDownTitle.innerText = "預計送達日期："
        const countDownP = document.createElement('span');
        countDownP.id = this.countDownId + "--string";
        // eta
        const etaP = document.createElement('p');
        etaP.id = this.countDownId + "--etaP";
        // combine
        // countDownSectionContainer.insertAdjacentElement('beforeend', countDownTitle)
        // countDownSectionContainer.insertAdjacentElement('beforeend', countDownP)
        countDownSectionContainer.insertAdjacentElement('beforeend', etaP);
        countDownSection.insertAdjacentElement('beforeend', countDownSectionContainer);
        if (targetSection) {
            targetSection.classList.add('etaSection');
            targetSection.insertAdjacentElement('beforeend', countDownSection);
        }
    }
    refreshCountDwn(countDownStringObj) {
        const countDownP = document.getElementById(this.countDownId + "--string");
        if (countDownP) {
            countDownP.innerText = `${countDownStringObj.hours}:${countDownStringObj.minutes}:${countDownStringObj.seconds}`;
        }
    }
}
const coutnDown_00 = new TimeCountDwn(23, 59, 'countDown_00', false);
const calETA_00 = new CalETA(4, 'countDown_00--etaP', coutnDown_00, 9, true);
