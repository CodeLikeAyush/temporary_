require('dotenv').config()
const mongoose = require('mongoose');

module.exports = async () => {
    try {
        await mongoose.connect("mongodb+srv://saurabhnitkcse:yfI5KruWOhTav7vS@cluster0.xcx9puo.mongodb.net/dds_profile?retryWrites=true&w=majority", {
        });
        console.log('Db Connected');

    } catch (error) {
        console.error('Error ============ ON DB Connection')
        console.log(error);
    }

};


