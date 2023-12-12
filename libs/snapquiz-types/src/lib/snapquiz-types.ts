type OcrResult = {
  valid: boolean;
  text: string;
}
type Quiz = {
  questionName: string;
  a: string;
  b: string;
  c: string;
  d: string;
  e: string;
  answer: string;
}

export { type OcrResult, type Quiz}
