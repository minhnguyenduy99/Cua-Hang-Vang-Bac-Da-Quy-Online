

module.exports = class DateHelper{
    
    static parseFrom(value){
        const castValue = new String(value);
        // Input is a string
        if (castValue instanceof String){
            const dateSplit = castValue.split('/');
            const dateCast = new Date(dateSplit[2], dateSplit[1] - 1, dateSplit[0]);
            return dateCast;
        }
        else{
            return value;
        }
    }

    static parseToYearMonth(value){
        if (value instanceof Date){
            return value;
        }
        const castValue = new String(value);
        // Input is a string
        if (castValue instanceof String){
            const dateSplit = castValue.split(/[/,-]/);
            if (dateSplit.length !== 2)
                throw new Error('Date string value is invalid');
            const dateCast = new Date(dateSplit[1], dateSplit[0] - 1, 1);
            return dateCast;
        }
        throw new Error('The value must be string-type');
    }

    static isValidYearRange(value, [min, max = 3000]){
        const year = value.getFullYear();
        return year >= min && year <= max; 
    }

    static getSeparateDateObj(date){
        let castDate = null;
        if (!(date instanceof Date))
            castDate = this.parseFrom(date);
        else
            castDate = date;

        return {
            day   : castDate.getDate(),
            month : castDate.getMonth(),
            year  : castDate.getFullYear()
        }
    }

    static isDateValid(day, month, year){
        if (day < 1)
            return false;
        if (month < 1 || month > 12)
            return false;

        switch(month){
            case 2: 
                // leap year
                if (year % 4 === 0 && year % 400 !== 0){
                    if (day <= 29)
                        return true;
                }
                if (day <= 28)
                    return true;
                return false;
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                if (day <= 31)
                    return true;
                return false;
            default: 
                if (day <= 30)
                    return true;
                return false;
        }
    }

    static isLeapYear(year){
        return year % 4 === 0 && year % 400 !== 0;
    }

    static getNumberOfDays(month, year){
        // invalid month
        if (month < 1 || month > 12)
            throw new Error('[DateHelper] month is invalid')
            
        switch(month){
            case 1: case 3: case 5: case 7: case 8: case 10: case 12:
                return 31;
            case 2:
                if (this.isLeapYear(year))
                    return 29;
                return 28;
            default:
                return 30;
        }
    }

    static getDistanceBetweenTwoDates(firstDate, lastDate){
        const dentaTime = lastDate.getTime() - firstDate.getTime();

        return {
            days: Math.round(dentaTime / (1000 * 3600 * 24))
        }
    }
}