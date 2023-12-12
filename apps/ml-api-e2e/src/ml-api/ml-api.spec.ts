import axios from 'axios';
import * as fs from "fs";
import {Quiz, OcrResult} from '@snapquiz/types'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const FormData = require('form-data');

const qa_path = "./qa-data/vision/";

describe('POST /api/v1/ocr', () => {
  it('should be clean', async () => {
    const form = new FormData();
    const buffer = fs.readFileSync(qa_path + 'sample1.jpeg');
    form.append ('file',  buffer, 'sample1.jpeg');

    const res = await axios.post(`api/v1/ocr`, form, {
      headers: {
        ...form.getHeaders()
      }
    });

    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(300);
    const response: OcrResult = res.data;
    expect(response.text).toEqual("foo")
  });
});

describe('POST /api/v1/create-quiz', () => {
  it('should be clean', async () => {
    const res = await axios.post(`api/v1/create-quiz`, {
      data : `For the native peoples of North America, contact with Europeans was less dramatic than that experienced by the Aztec and Inca empires upon the arrival of the Spanish conquistadors. Nonetheless, Spanish explorers attempting to penetrate into what would become the United States left three major legacies for the tribes: disease, horses and other domesticated animals, and metal tools and firearms.
      Disease. The most serious threat the native peoples faced was not the superior arms of the Europeans but the diseases they brought with them to the New World. With the possible exception of syphilis, the Western Hemisphere was effectively free of infectious disease prior to European contact. The indigenous population, with no reservoir of natural immunity or built‐up resistance, succumbed quickly to diphtheria, mumps, measles, and smallpox. Smallpox, the main killer, spread rapidly beyond the initial European carriers. Tribes that met and traded over long distances infected one another and carried the disease back to their villages. There is evidence that smallpox had already surfaced in Peru sometime before the arrival of Francisco Pizarro in 1532.`
    });
    const response: Quiz[] = res.data
    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(300);

    expect(response).toEqual("foo")
  });
});
