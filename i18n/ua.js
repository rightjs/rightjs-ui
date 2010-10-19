/**
 * RightJS UI Internationalization: Ukrainian module
 *
 * Copyright (C) Maxim Golubev
 * Copyright (C) Nikolay Nemshilov
 */
if (self.Calendar) {
  $ext(Calendar.Options, {
    firstDay: 0
  });

  $ext(Calendar.i18n, {
    Done:            'Гаразд',
    Now:             'Зараз',
    NextMonth:       'Наступный мiсяць',
    PrevMonth:       'Попереднiй мiсяць',
    NextYear:        'Наступний рiк',
    PrevYear:        'Попереднiй рiк',

    dayNames:        $w('Неділя Понеділок Вівторок Середа Четвер П\'ятниця Субота'),
    dayNamesShort:   $w('Ндл Пнд Втр Срд Чтв Птн Сбт'),
    dayNamesMin:     $w('Нд Пн Вт Ср Чт Пт Сб'),
    monthNames:      $w('Січень Лютий Березень Квітень Травень Червень Липень Серпень Вересень Жовтень Листопад Грудень'),
    monthNamesShort: $w('Січ Лют Бер Квіт Трав Черв Лип Серп Вер Жовт Лист Груд')
  });
}

if (self.Lightbox) {
  $ext(Lightbox.i18n, {
    Close: 'Сховати',
    Prev:  'Попереднє зображення',
    Next:  'Наступне зображення'
  });
}

if (self.InEdit) {
  $ext(InEdit.i18n, {
    Save:   "Зберегти",
    Cancel: "Скасувати"
  });
}

if (self.Colorpicker) {
  $ext(Colorpicker.i18n, {
    Done: 'Гаразд'
  });
}

if (self.Dialog) {
  $ext(Dialog.i18n, {
    Ok:       'Гаразд',
    Close:    'Сховати',
    Cancel:   'Сховати',
    Help:     'Помощь',
    Expand:   'Во все окно',
    Collapse: 'Обычный размер',
    Alert:    'Внимание!',
    Confirm:  'Подтверждение',
    Prompt:   'Ввод данных'
  });
}
