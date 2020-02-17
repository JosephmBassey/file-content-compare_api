import { ContentModel } from '../content/Models'


class ContentService {

    async addContentToDB(data) {
        const contentData = new ContentModel({
            ...data
        });
        await contentData.save();
    }
    async updateContentToDB(id, data) {
        data.recheck = true,
            await ContentModel.findByIdAndUpdate(id, {
                ...data
            })
    }
    async getAllContentFromDB() {
        return await ContentModel.find()
    }
    async deleteContentFromDB(id) {
        return await ContentModel.findByIdAndRemove(id)
    }
    async getSingleContentFromDB(id) {
        return await ContentModel.findById(id)
    }
}







export default new ContentService();