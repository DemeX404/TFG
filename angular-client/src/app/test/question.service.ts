import { Injectable } from '@angular/core';
import { DropdownQuestion } from '../shared/dynamic-form/model/question-dropdown';
import { QuestionBase } from '../shared/dynamic-form/model/question-base';
import { TextboxQuestion } from '../shared/dynamic-form/model/question-textbox';
import { ImagePictureQuestion } from '../shared/dynamic-form/model/question-profile';
import { of } from 'rxjs';
import { PhoneQuestion } from '../shared/dynamic-form/model/question-phone';
@Injectable()
export class QuestionService {
  // TODO: get from a remote source of question metadata
  getQuestions() {
    const questions: QuestionBase<string>[] = [
      // new DropdownQuestion({
      //   key: 'favoriteAnimal',
      //   label: 'Favorite Animal',
      //   options: [
      //     {key: 'cat',  value: 'Cat'},
      //     {key: 'dog',  value: 'Dog'},
      //     {key: 'horse',  value: 'Horse'},
      //     {key: 'capybara',  value: 'Capybara'},
      //   ],
      //   order: 3
      // }),
      new ImagePictureQuestion({
        key: 'profilePicture',
        order: 0
      }),
      new TextboxQuestion({
        key: 'name',
        label: 'Name',
        type: 'text',
        required: true,
        order: 1
      }),
      new TextboxQuestion({
        key: 'surname',
        label: 'Surname',
        type: 'text',
        value: '',
        order: 2
      }),
      new TextboxQuestion({
        key: 'email',
        label: 'Email',
        type: 'email',
        value: '',
        order: 3
      }),
      new TextboxQuestion({
        key: 'password',
        label: 'Password',
        type: 'password',
        value: '',
        order: 4
      }),
      new PhoneQuestion({
        key: 'phone',
        label: 'Phone',
        labelExtra: 'País/Prefijo',
        type: 'tel',
        value: '',
        order: 5
      })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }
}