// b2b-ecommerce/src/app/models/WebsiteConfig.js
import mongoose from 'mongoose';

const WebsiteConfigSchema = new mongoose.Schema({
    websiteName: {
        type: String,
        required: true,
        default: 'B2B-eCommerce'
    },
    websiteLogo: {
        type: String, // Assuming this will be a URL or file path to the logo
        required: true,
        default: '/next.svg'
    },
    colorTheme: {
        type: String, // You might want to define a more complex structure for color theme
        required: true,
        default: '#1976d2'
    },
    fontColor: {
        type: String,
        required: true,
        default: '#ffffff'
    },
}, { collection: 'websiteconfigs' }); // Explicitly define collection name

// Enforce that only one document can exist in this collection
WebsiteConfigSchema.pre('save', async function (next) {
    if (this.isNew) {
        const count = await mongoose.model('WebsiteConfig').countDocuments();
        if (count >= 1) {
            return next(new Error('Only one website configuration record is allowed.'));
        }
    }
    next();
});

export default mongoose.models.WebsiteConfig || mongoose.model('WebsiteConfig', WebsiteConfigSchema)