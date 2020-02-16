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

            let firstStudentFilePath = path.resolve(`./src/public/uploads/${Date.now()}${firstStudentFile.name}`);
            const secondStudentFilePath = path.resolve(`./src/public/uploads/${Date.now()}${secondStudentFile.name}`)
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

                const response = await contentService.addContentToDB(data)
                return res.status(201).json({
                    success: true,
                    message: 'Both student file content are the same',
                    percentage: '100 percent same file content',
                    data: response

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
            if (firstStudentFile.size === secondStudentFile.size && contentMatch === true) {
                await contentService.addContentToDB(data)
                return res.status(201).json({
                    success: true,
                    message: 'Both student file content are 90 percent likely to be the same, please review!',
                    percentage: '80 percent same file content',
                    firstStudentFileSize: firstStudentFile.size,
                    secondStudentFileSize: secondStudentFile.size,
                });
            }
            await contentService.addContentToDB(data)
            return res.status(201).json({
                success: true,
                message: 'Different file and Different Content!',
                percentage: '0 percent match',
                firstStudentFileSize: firstStudentFile.size,
                secondStudentFileSize: secondStudentFile.size,
            });
        } catch (error) {
            console.log(error);
            res.status(400).json({
                msg: 'unable to compare file'
            });
        }
    }
    static async recheckContent(req, res, next) {
        try {
            let content = await ContentModel.findById(req.ss.id);
            if (!content) {
                return res.status(404).json({
                    error: 'no content found for the given ID.',
                });
            }

            const { firstStudentFilePath, secondStudentFilePath, } = content
            const { error } = validateContent(req.body)
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.details[0].message,

                });
            }
            let firstStudentFileData = await fs.readFile(firstStudentFilePath, 'utf8')
            let secondStudentFileData = await fs.readFile(secondStudentFilePath, 'utf8')

            if (firstStudentFileData.data.toString().toLowerCase().trim().replace(/\s(?=\s)/g, '') === secondStudentFileData.data.toString().toLowerCase().trim().replace(/\s(?=\s)/g, '')) {
                return res.status(200).json({
                    success: true,
                    message: 'Both student file content are the same',
                    percentage: '100 percent match',

                });
            }
            let bufferIndex = 0,
                length = firstStudentFileData.data.length,
                contentMatch = true;
            while (bufferIndex < length) {
                if (firstStudentFile.data[bufferIndex] === secondStudentFile.data[bufferIndex]) {
                    bufferIndex++;
                } else {
                    contentMatch = false;
                    break;
                }
            }
            if (firstStudentFile.size === secondStudentFile.size && contentMatch === true) {
                return res.status(200).json({
                    success: true,
                    message: 'Both student file content are 90 percent likely to be the same, please review!',
                    percentage: '90 percent match',
                    firstStudentFileSize: firstStudentFile.size,
                    secondStudentFileSize: secondStudentFile.size,
                });
            }

            firstStudentFilePath = path.resolve(`./src/public/uploads/${Date.now()}{firstStudentFile.name}`);
            secondStudentFilePath = path.resolve(`./src/public/uploads/${Date.now()}{secondStudentFile.name}`)
            firstStudentFile.mv(firstStudentFilePath, function(err) {
                if (err)
                    return res.status(500).send(err);
            })
            secondStudentFile.mv(secondStudentFilePath, function(err) {
                if (err)
                    return res.status(500).send(err);
            })
            const contentData = new ContentModel({
                ...req.body,
                firstStudentFilePath,
                secondStudentFilePath
            });
            await contentData.save();

            return res.status(201).json({
                success: true,
                message: 'Different file and Different Content!',
                percentage: '0 percent match',
                firstStudentFileSize: firstStudentFile.size,
                secondStudentFileSize: secondStudentFile.size,
            });

        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: 'Error occur while running content recheck',
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