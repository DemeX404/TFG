import { QuestionBase } from './question-base';
export class ImagePictureQuestion extends QuestionBase<string> {
  override controlType = 'imagepicture';
}