import { ContentModel, validateContent } from './Models'
import path from 'path'
import fs from "fs-extra";
import contentService from '../service/contentService';

class Content {
    static async getAllContent(req, res, next) {
        try {
            const content = await contentService.getAllContentFromDB()
            return res.status(200).json({
                success: true,
                content,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error occur while fetching content from DB',
            });
        }
    }
    static async getSingleContent(req, res, next) {
        try {
            const content = await contentService.getSingleContentFromDB(req.params.id)
            if (!content) {
                return res.status(404).json({
                    error: 'no content found for the given ID.',
                });
            }
            return res.status(200).json({
                success: true,
                data: content

            });
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: 'Error occur while fetching content from DB',

            });
        }
    }
    static async compareContent(req, res, next) {
        try {
            const { error } = validateContent(req.body)
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.details[0].message,
                });
            }
            const { firstStudentFile, secondStudentFile } = req.files

            let firstStudentFilePath = path.join(__dirname, `../../../public/uploads/${Date.now()}${firstStudentFile.name}`);
            const secondStudentFilePath = path.join(__dirname, `../../../public/uploads/${Date.now()}${secondStudentFile.name}`)

            firstStudentFile.mv(firstStudentFilePath, function(err) {
                if (err)
                    return res.status(500).send(err);
            })
            secondStudentFile.mv(secondStudentFilePath, function(err) {
                if (err)
                    return res.status(500).send(err);
            })
            let data = { ...req.body, firstStudentFilePath, secondStudentFilePath }



            if (firstStudentFile.data.toString().toLowerCase().trim().replace(/\s(?=\s)/g, '') === secondStudentFile.data.toString().toLowerCase().trim().replace(/\s(?=\s)/g, '')) {
                data.contentFeedBack = 'Same File Content Detected'
                contentService.addContentToDB(data)
                return res.status(201).json({
                    success: true,
                    message: 'Both student file content are the same, using  content comparison',
                    percentage: '100 percent same file content',

                });
            }
            let bufferIndex = 0,
                length = firstStudentFile.data.length,
                contentMatch = true;
            while (bufferIndex < length) {
                if (firstStudentFile.data[bufferIndex] === secondStudentFile.data[bufferIndex]) {
                    bufferIndex++;
                } else {
                    contentMatch = false;
                    break;
                }
            }
            if (contentMatch) {
                data.contentFeedBack = 'File content look almost the same'
                contentService.addContentToDB(data)
                return res.status(201).json({
                    success: true,
                    message: 'Both student file content are 90 percent likely to be the same, using buffer content to check!',
                    percentage: '90 percent same file content',
                });
            }
            if (firstStudentFile.size === secondStudentFile.size) {
                data.contentFeedBack = 'File content look almost the same'
                contentService.addContentToDB(data)
                return res.status(201).json({
                    success: true,
                    message: 'Both student file content are 50 percent likely to be the same,using file size to check!',
                    percentage: '50 percent same file content',
                    firstStudentFileSize: firstStudentFile.size,
                    secondStudentFileSize: secondStudentFile.size,
                });
            }
            data.contentFeedBack = 'Different File Content '
            contentService.addContentToDB(data)
            return res.status(201).json({
                success: true,
                message: 'Different file and Different Content!',
                percentage: '0 percent match',
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Error Occur while  comparing files'
            });
        }
    }
    static async recheckContent(req, res, next) {
        try {

            const content = await ContentModel.findById(req.params.id)
            if (!content) {
                return res.status(404).json({
                    success: false,
                    message: 'no content found for the given ID.',
                });
            }
            const { firstStudentFile, secondStudentFile } = req.files

            let firstStudentFilePath = path.join(__dirname, `../../../public/uploads/${Date.now()}${firstStudentFile.name}`);
            const secondStudentFilePath = path.join(__dirname, `../../../public/uploads/${Date.now()}${secondStudentFile.name}`)

            firstStudentFile.mv(firstStudentFilePath, function(err) {
                if (err)
                    return res.status(500).send(err);
            })
            secondStudentFile.mv(secondStudentFilePath, function(err) {
                if (err)
                    return res.status(500).send(err);
            })
            let data = { ...req.body, firstStudentFilePath, secondStudentFilePath }



            if (firstStudentFile.data.toString().toLowerCase().trim().replace(/\s(?=\s)/g, '') === secondStudentFile.data.toString().toLowerCase().trim().replace(/\s(?=\s)/g, '')) {
                data.contentFeedBack = 'Same File Content Detected'
                contentService.updateContentToDB(req.params.id, data)
                return res.status(201).json({
                    success: true,
                    recheck: true,
                    message: 'Both student file content are the same, using  content comparison',
                    percentage: '100 percent same file content',
                });
            }
            let bufferIndex = 0,
                length = firstStudentFile.data.length,
                contentMatch = true;
            while (bufferIndex < length) {
                if (firstStudentFile.data[bufferIndex] === secondStudentFile.data[bufferIndex]) {
                    bufferIndex++;
                } else {
                    contentMatch = false;
                    break;
                }
            }
            if (contentMatch) {
                data.contentFeedBack = 'File content look almost the same'
                contentService.updateContentToDB(req.params.id, data)
                return res.status(201).json({
                    success: true,
                    message: 'Both student file content are 90 percent likely to be the same, using buffer content to check!',
                    percentage: '90 percent same file content',
                });
            }
            if (firstStudentFile.size === secondStudentFile.size) {
                data.contentFeedBack = 'File content look almost the same'
                contentService.updateContentToDB(req.params.id, data)
                return res.status(201).json({
                    success: true,
                    message: 'Both student file content are 50 percent likely to be the same,using file size to check!',
                    percentage: '50 percent same file content',
                    firstStudentFileSize: firstStudentFile.size,
                    secondStudentFileSize: secondStudentFile.size,
                });
            }
            data.contentFeedBack = 'Different File Content '
            contentService.updateContentToDB(req.params.id, data)
            return res.status(201).json({
                success: true,
                message: 'Different file and Different Content!',
                percentage: '0 percent match',
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Error Occur while  comparing files'
            });
        }
    }
    static async deleteContent(req, res, next) {
        try {
            const content = await contentService.deleteContentFromDB(req.params.id)
            if (!content) {
                return res.status(404).json({
                    success: false,
                    message: 'no content found for the given ID.',
                });
            }
            return res.status(200).json({
                success: true,
                message: 'content deleted successfully.',
            });
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: 'Error occur while deleting content from DB',
            });
        }
    }
}

export default Content;