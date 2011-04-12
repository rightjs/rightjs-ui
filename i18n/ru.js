/**
 * RightJS UI Internationalization: Russian module
 *
 * Copyright (C) Nikolay Nemshilov
 */
RightJS.Object.each({

  Calendar: {
    Done:            'Готово',
    Now:             'Сейчас',
    NextMonth:       'Следующий месяц',
    PrevMonth:       'Предыдущий месяц',
    NextYear:        'Следующий год',
    PrevYear:        'Предыдущий год',

    dayNames:        'Воскресенье Понедельник Вторник Среда Четверг Пятница Суббота'.split(' '),
    dayNamesShort:   'Вск Пнд Втр Срд Чтв Птн Сбт'.split(' '),
    dayNamesMin:     'Вс Пн Вт Ср Чт Пт Сб'.split(' '),
    monthNames:      'Январь Февраль Март Апрель Май Июнь Июль Август Сентябрь Октябрь Ноябрь Декабрь'.split(' '),
    monthNamesShort: 'Янв Фев Мар Апр Май Инь Иль Авг Сен Окт Ноя Дек'.split(' ')
  },

  Lightbox: {
    Close: 'Закрыть',
    Prev:  'Предыдущее изображение',
    Next:  'Следующее изображение'
  },

  InEdit: {
    Save:   "Сохранить",
    Cancel: "Отмена"
  },

  Colorpicker: {
    Done: 'Готово'
  },

  Dialog: {
    Ok:       'Готово',
    Close:    'Закрыть',
    Cancel:   'Отмена',
    Help:     'Помощь',
    Expand:   'Во все окно',
    Collapse: 'Обычный размер',

    Alert:    'Внимание!',
    Confirm:  'Подтверждение',
    Prompt:   'Ввод данных'
  }

}, function(module, i18n) {
  if (self[module]) {
    RightJS.$ext(self[module].i18n, i18n);
  }
});