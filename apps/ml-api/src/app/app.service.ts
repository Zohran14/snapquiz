import {Injectable, Logger, OnModuleInit} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import * as apiLogger from "abstract-logging";
import {ImageAnnotatorClient} from "@google-cloud/vision";
import {Quiz, OcrResult} from '@snapquiz/types'
import OpenAI from "openai";
import {google} from "@google-cloud/vision/build/protos/protos";
import IAnnotateImageResponse = google.cloud.vision.v1.IAnnotateImageResponse;

function parseResponse(response: string) {
    const lines = response.split("\n\n")

    const answerString: string = lines.splice(-1)[0]
    const answers = answerString.split(": ")[1].split('').map((val) => val.toLowerCase())
    console.log(answers)
    const questions = []
    console.log("length: " + lines.length)
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const parts = line.trim().split("\n")

        if (parts.length > 1) {
            const questionName = parts[0]
            const options = parts.slice(1)
            const answer = answers[i]

            const question: any = {questionName, answer}
            options.forEach((option, index) => {
                const [letter, text] = option.split(') ')
                if (index === 0) {
                    question.a = text
                } else if (index === 1) {
                    question.b = text
                } else if (index === 2) {
                    question.c = text
                } else if (index === 3) {
                    question.d = text
                } else if (index === 4) {
                    question.e = text
                }


            })
            console.log("question: " + question)
            questions.push(question)

        }
    }
    return questions
}

@Injectable()
export class AppService implements OnModuleInit {
    private imageClient: ImageAnnotatorClient;
    private openai: OpenAI;
    private GOOGLE_CLIENT_EMAIL: string;
    private GOOGLE_PRIVATE_KEY: string;
    private OPENAI_API_KEY: string;

    constructor(
        private readonly logger: Logger,
        private readonly configService: ConfigService
    ) {
        this.OPENAI_API_KEY = configService!.get("OPENAI_API_KEY");
        this.GOOGLE_CLIENT_EMAIL = configService!.get("GOOGLE_CLIENT_EMAIL");
        this.GOOGLE_PRIVATE_KEY = configService!.get("GOOGLE_PRIVATE_KEY");

        apiLogger.debug = (args) => this.logger.debug(args);
        apiLogger.info = (args) => this.logger.log(args);
        apiLogger.error = (args) => this.logger.error(args);
        apiLogger.warn = (args) => this.logger.warn(args);
    }

    async createQuiz(content: string): Promise<Quiz[]> {
        console.log("content: " + content);
        const prompt = `Please create a multiple-choice test based on the following data:\n\n${content}\n\nFor each question, provide five answer choices in the exact format:\n\n{question}?\nA) {choice}\nB) {choice}\nC) {choice}\nD) {choice}\nE) {choice}\n\n{question2}?\nA) {choice}\nB) {choice}\nC) {choice}\nD) {choice}\nE) {choice}\n\nAnd so on for as many questions as needed.\n\nAnswer Key: {Provide the correct answer choices in a single line WITHOUT question numbers and WITH the word 'Answer Key:' at the beginning, e.g., 'Answer Key: ABEDC...'} Please be as accurate as possible.`
        const stringTest = await this.openai.chat.completions.create({
            messages: [{role: 'user', content: prompt}],
            model: 'gpt-3.5-turbo',
        });
        const res: Quiz[] = parseResponse(stringTest['choices'][0]['message']['content'])
        console.log(JSON.stringify(res[0]))
        return res;
    }

    async ocr(input: Buffer): Promise<OcrResult> {
        let result:IAnnotateImageResponse[];
        try {
            result = await this.imageClient.documentTextDetection(input);
        } catch (err) {
            if (err.code == 401) {
                this.logger.error("Authentication failed with google vision");
            } else {
                this.logger.error("Unknown error calling google vision " + err);
                throw err;
            }
        }

        const fullTextAnnotation = result[0].fullTextAnnotation;
        let validate;

        try {
          validate = await this.openai.chat.completions.create({
            messages: [{
              role: 'user',
              content: `Analyze the text below and determine if it is a valid document. Do not judge based on spelling or grammar. If so, respond by cleaning up any spelling mistakes in the content below. WRITE NOTHING ELSE. If the text below is not a valid document respond with ‘no’:\n\n${fullTextAnnotation.text}`
            }],
            model: 'gpt-3.5-turbo',
          });
        } catch (err) {
          if (err.code == 401) {
            this.logger.error("Authentication failed with open ai");
          } else {
            this.logger.error("Unknown error calling openai " + err);
            throw err;
          }
        }

        const text = validate['choices'][0]['message']['content']
        const isValid = text.toLowerCase() !== "no"
        // const isValid = false
        return {text: isValid ? text : fullTextAnnotation.text, valid: isValid};
    }

    async onModuleInit(): Promise<void> {
        //load the NLP model
        const client = new ImageAnnotatorClient({
            credentials: {
                client_email: this.GOOGLE_CLIENT_EMAIL,
                private_key: this.GOOGLE_PRIVATE_KEY.split(String.raw`\n`).join('\n'),
            },
        });

        const openai = new OpenAI({
            apiKey: this.OPENAI_API_KEY, // defaults to process.env["OPENAI_API_KEY"]
        });

        this.imageClient = client;
        this.openai = openai;
    }
}
