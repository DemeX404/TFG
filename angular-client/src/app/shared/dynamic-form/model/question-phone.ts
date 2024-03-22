import { QuestionBase } from './question-base';
export class PhoneQuestion extends QuestionBase<string> {
  override controlType = 'phone';
}