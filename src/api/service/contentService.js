import { ContentModel } from '../content/Models'


class ContentService {

    async addContentToDB(data) {
        const contentData = new ContentModel({
            ...data
        });
        return await contentData.save();
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