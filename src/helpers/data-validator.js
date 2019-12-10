

module.exports = class DataValidator{
    static isPrice(){
        return {
            isInt: true,
            isNonNegative(value){
                if (value < 0){
                    throw new Error('Price cannot be negative');
                }
            },
            is500Odd(value){
                if (value % 500 != 0){
                    throw new Error('Value must be a division of 500');
                }
            }
        }
    }

    static isNonNegativeInt(value){
        return {
            isInt: true,
            isNonNegative(value){
                if (value < 0){
                    throw new Error('Value cannot be negative');
                }
            }
        }
    }

    static isNonNegative(value){
        return {
            isNumeric: true,
            isNonNegative(value){
                if (value < 0){
                    throw new Error('Value cannot be negative');
                }
            }
        }
    }
}