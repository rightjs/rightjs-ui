/**
 * RightJS UI Internationalization: Ukrainian module
 *
 * Copyright (C) Nikolay Nemshilov
 */
if (self.Calendar) {
  $ext(Calendar.i18n, {
    Done:            'Готово',
    Now:             'Сейчас',
    Next:            'Следующий месяц',
    Prev:            'Предыдущий месяц',
    NextYear:        'Следующий год',
    PrevYear:        'Предыдущий год',

    dayNames:        $w('Неділя Понеділок Вівторок Середа Четвер П\'ятниця Субота'),
    dayNamesShort:   $w('Ндл Пнд Втр Срд Чтв Птн Сбт'),
    dayNamesMin:     $w('Нд Пн Вт Ср Чт Пт Сб'),
    monthNames:      $w('Січень Лютий Березень Квітень Травень Червень Липень Серпень Вересень Жовтень Листопад Грудень'),
    monthNamesShort: $w('Січ Лют Бер Квіт Трав Черв Лип Серп Вер Жовт Лист Груд')
  });
}

if (self.Lightbox) {
  $ext(Lightbox.i18n, {
    CloseTitle: 'Закрыть',
    PrevTitle:  'Предыдущее изображение',
    NextTitle:  'Следующее изображение'
  });
}

if (self.InEdit) {
  $ext(InEdit.i18n, {
    save:   "Сохранить",
    cancel: "Отмена"
  });
}

if (self.Colorpicker) {
  $ext(Colorpicker.i18n, {
    Done: 'Готово'
  });
}

