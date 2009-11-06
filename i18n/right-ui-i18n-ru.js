/**
 * RightJS UI Internationalization: Russian module
 *
 * Copyright (C) Nikolay V. Nemshilov aka St.
 */
if (self.Calendar) {
  $ext(Calendar.i18n, {
    Done:            'Готово',
    Now:             'Сейчас',
    Next:            'Следующий месяц',
    Prev:            'Предыдущий месяц',
    NextYear:        'Следующий год',
    PrevYear:        'Предыдущий год',

    dayNames:        $w('Вокскресенье Понедельник Вторник Среда Четверг Пятница Суббота'),
    dayNamesShort:   $w('Вск Пнд Втр Срд Чтв Птн Сбт'),
    dayNamesMin:     $w('Вс Пн Вт Ср Чт Пт Сб'),
    monthNames:      $w('Январь Февраль Март Аперль Май Инюнь Июль Август Сентябрь Октябрь Ноябрь Декабрь'),
    monthNamesShort: $w('Янв Фев Мар Апр Май Инь Иль Авг Сен Окт Ноя Дек')
  });
}

if (self.Lightbox) {
  $ext(Lightbox.i18n, {
    CloseTitle: 'Закрыть',
    PrevTitle:  'Предыдущее изображение',
    NextTitle:  'Следующее изображение'
  });
}
